+++
title = 'Board Bringup for Orange Pi Zero3 (Part 2)'
date = 2024-03-24T13:17:43-07:00
draft = false
type = "post"
+++
At this stage, you should have a partitioned and formatted micro-SD card with u-boot loaded on the first partition. Your project directory should look something like this:
```
opi-image/
| - - linux/
| - - u-boot/
| - - arm-trusted-firmware/
```
Please note that these instructions assume you are running on arm64 architecture.

## Configure the Kernel
Navigate into `linux/` and run the following command:
```
ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- make defconfig
```
If all you want is the barebones linux kernel, then skip this next part. At the time of writing, the Orange Pi Zero3's wifi chip (either the UWE5622 or 20U5622) are not supported in the mainline kernel. The linux-sunxi community does provide a link to the firmware blobs, but I have no idea what is in them (see security concerns in Part 1) so I opted for a safer option.

I have a TP-Link TL-WN725N USB Dongle on-hand, and I found a very helpful resource called [Linux Wireless][1] that provides information on chipsets with mainline kernel support. Weirdly, I couldn't find which chipset the TL-WN725N used in any official documentation, but after some Google sleuthing I was able to determine that my model (probably) used a Realtek chipset named RTL8188EU. Using Linux Wireless, I was able to confirm that this [chipset has mainline support using the rtl8xxxu driver][2].

Armed with this information, we can go about manually configuring our kernel to have the necessary driver support. Run the following command:
```
ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- make menuconfig
```
Navigate to the following menu:
```
Device drivers ->  Network device support -> Wireless Lan
```
At this menu, scroll down to "Realtek rtlwifi family of devices". It should look something like this:
{{< image src="/images/menuconfig-realtek-1.png" alt="Kernel config menu image" width="300px" >}}
{{< /image >}}

Press "M" to include the rtlwifi family drivers as modules, then navigate into the submenu. To be on the safe side, I selected all drivers to be included as modules. That said, if you are absolutely certain about which chipset your device uses, you can be more selective. My menu looked like this:
{{< image src="/images/menuconfig-realtek-2.png" alt="Kernel config menu image" width="300px" >}}
{{< /image >}}

Now, exit out of the menu and, when prompted, select 'yes' to save your configuration options.

## Creating our OS
Now that the kernel is configured, we can begin the compilation process. This stage has four parts:
1. Compiling the kernel image.
2. Compiling the device tree binary (.dtb) file.
3. Compiling the kernel modules.
4. Creating our Root filesystem.
4. Installing header files.

While our image, device tree binary, and modules are created with `make` commands using the Linux repo's makefile, our Root filesystem (AKA Rootfs), requires a different approach. 

### Kernel Image
To compile the Kernel Image run this command:
```
ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- make Image
```

### Device Tree
To create the device tree binary file run this command:
```
ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- make -j4 dtbs
```

### Modules
To create the modules for the kernel run this command:
```
ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- make -j4 modules
```

### Rootfs
Now we need to create rootfs which, among other things, will actually contain the modules and header files our OS will need.

To do this, we'll use a tool called deboostrap that will allow us to 'bootstrap' a root filesystem onto our target partition.

As an aside - the term 'bootstrapping' in embedded linux/linux generally was new to me. My current understanding is that it refers to the process of setting up a minimal base system for your image to use (directories like /usr, /proc, /lib, and so on). I tried to find a more in-depth definition but the term seems a bit ubiquitous - for example, I found a posts that used bootloader and bootstrap interchangeably (which seemed wrong but I'm no expert).

Note that these instructions assume that your workspace has the same architecture as your target and you are running a Debian-based system.

First, install debootstrap:
```
sudo apt install debootstrap
```

We have to mount the second partition of our Micro-SD card to /mnt. Run the following command, replacing 'sdX2' with the applicable block device representing your Micro-SD card:
```
sudo mount /dev/sdX2 /mnt
```
Stage 1 of the bootstrapping process requires that we give debootstrap a destination (`/mnt`), a debian release (I chose `bookworm`), and our architecture (`arm64`). Run this command:
```
debootstrap --arch=arm64 --foreign bookworm /mnt/
```
The foreign flag tells debootstrap to download and unpack the base system packages but not to fully configure them.

To complete stage 2, first run this command:
```
chroot /mnt /bin/sh -i
```
`Chroot` (short for 'Change Root') allows us to change the root directory for the current process and its children. Importantly, it also prevents the process from accessing any directories outside of the newly designated root directory.

So, this command is telling our shell to change root to `/mnt`, and open an instance of the bourne shell (`/bin/sh`) in interactive mode (`-i`).

The two main reasons for doing this, from what I have been able to decipher, are:
1. protecting our host system from debootstrap, and
2. allowing us to use host system resources (e.g. network access) to configure our new filesystem.

Ok, without further ado, lets run the second stage in our newly chrooted shell:
```
/debootstrap/debootstrap --second-stage
```
Once complete, if you run the `ls` command (still in your chrooted shell) you should see a normal root directory. There are a few housekeeping steps we should take care of before we exit out:
- set a root password by running the `passwd` command. This will be how you login as root to your new linux OS.
- changing the new rootfs hostname by running `vim /etc/hostname` and changing it to be different from your host machine's hostname.
- enable the serial console by running `systemctl enable serial-getty@ttyS0.service` to ensure we have serial port access on ttyS0 on boot-up.
- update your file system table (fstab) to reflect the partitions we set up in part 1. Run `vim /etc/fstab` and add the following:
```
none  /tmp	tmpfs	defaults,noatime,mode=1777	0	0
/dev/mmcblk0p2	/	    ext4	defaults	0	1 
/dev/mmcblk0p1	/boot	vfat	defaults	0	2 
```

Once this is complete, you can exit the chroot environment by typing `exit`. All done!

### Install Modules
Earlier, we compiled our OS's modules but didn't actually install them anywhere. With our rootfs now configured (and still mounted at `/mnt`), lets install them so that your kernel image will be able to make use of them. Ensuring you are back in your `/linux` directory, run the following command:
```
ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- INSTALL_MOD_PATH=/mnt/lib/ make modules modules_install
```

### Install Header Files
Linux header files act as your system's API for user-space programs to access certain kernel level resources. Now that we have our rootfs set up, we can install these as well. Run the following command:
```
ARCH=arm64 INSTALL_HDR_PATH=/mnt/usr/ make headers_install
```

### Next Steps
Now that the rootfs is configured, modules have been installed, and the header files are installed, it's time to set up the boot partition.

## Copy Image and Device Tree
First things first, unmount `/dev/sdX2` from `/mnt`:
```
sudo umount /mnt
```
And mount `/dev/sdX1`:
```
sudo mount /dev/sdX1 /mnt
```
We now need to copy the kernel and device tree binary into the boot partition. Navigate to your `linux/` directory. Run the following command to copy the kernel image file to the boot partition:
```
sudo cp arch/arm64/boot/Image /mnt
```
Run the following command to copy the device tree binary to the boot partition:
```
sudo cp arch/arm64/boot/dts/allwinner/sun50i-h618-orangepi-zero3.dtb /mnt/device_tree.dtb
```
Note that this command renames the .dtb file. I did this to save some typing later on, but it is not mandatory.

## Create Boot Script
If you were to try booting up with your Micro-SD card as-is, you'd see u-boot begin it's set-up and then...nothing (or, more likely, some sort of error or warning). This is because we haven't told u-boot which files to load or where anything is. Now, if you want to interrupt the auto-boot process and manually enter the necessary commands in each time you boot, you can. To make life easier though, let's write a boot script.

First, navigate to `opi-image/` and open a .txt file. I called mine `boot.txt`:
```
vim boot.txt
```
In your .txt file, enter the following:
```
setenv bootargs root=/dev/mmcblk0p2
load mmc 0:1 $kernel_addr_r Image
load mmc 0:1 $fdt_addr_r device_tree.dtb
booti $kernel_addr_r - $fdt_addr_r
```
Save and exit your .txt file. Before we convert this to a boot script, let's first break down what's happening:
1. We tell u-boot which partition our rootfs is located on.
2. We load our kernel Image file from the multimedia card's first partition into memory at the memory address stored in $kernel_addr_r
3. We load our device tree binary from the mmc's first partition into memory at the address stored in $fdt_addr_r
4. We run the booti command (for booting Image files), passing in the kernel address first and then the device tree address.

A few important points:
- $kernel_addr_r and $fdt_addr_r were predefined variables in my u-boot version. If you're unsure if your system has them, you can run the `printenv` command while in the u-boot environment and check
- I was curious about the syntax for the `booti` command. I first though it was saying "boot the files located between X and Y" because of the dash. However, it looks like that's actually just used as a way to demarcate separate arguments. We're actually saying "Boot the image located at X, where the device tree is located at Y". 

Now let's convert the .txt file into a script file. We can use the u-boot tool `mkimage` to do this by running the following command:
```
u-boot/tools/mkimage -C none -A arm -T script -d boot.txt boot.scr
```
Now copy the newly-made boot.scr file to the boot partition:
```
sudo cp boot.scr /mnt
```
That's it! You can now unmount the boot partition and eject your Micro-SD card:
```
sudo umount /mnt
sudo eject /dev/sdX
```
Insert the Micro-SD Card into the Zero3, power it on, and watch the custom linux OS boot. Once booted, you should be able to login as `root` using the password set during the debootstrap process.

Hopefully you found this to be a helpful guide. Thanks for reading!

[1]: https://wireless.wiki.kernel.org/welcome
[2]: https://wireless.wiki.kernel.org/en/users/drivers/rtl819x