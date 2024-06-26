+++
title = 'Linux Headers for Orange Pi Zero3'
date = 2024-03-26T16:30:10-07:00
draft = false
type = "post"
+++
After successfully bringing up my Zero3 I wanted to learn more about kernel module development. While following along with an introductory tutorial I wrote a makefile to handle the compilation of `.c` files into `.ko` files that I could load. The makefile was fairly simple - it had a single recipe for compiling the module:
```
obj-m += mymodule.o

all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules
```
Seems simple, right? All we're doing is using the contents of `build` to compile a kernel module. Except when I tried running it for the first time I saw something like this:
```
user@orange:~/workbench$ make
make -C /lib/modules/6.8.0/build M=/home/user/workbench modules
make[1]: Entering directory '/host_machine/include'
make[1]: *** No rule to make target 'modules'.  Stop.
make[1]: Leaving directory '/host_machine/include'
make: *** [Makefile:4: all] Error 2
```
On a hunch, I checked the symlink at `/lib/modules/6.8.0/build` and saw that it was pointing to a directory on the host machine (AKA a completely different system) I used to compile the kernel.

{{< image src="/images/linux-headers-for-orange-pi-zero3/confused.jpg"  alt="A confused guy" width="450px" >}}
Artist's recreation of me trying to understand how this happened.
{{< /image >}}

After a bit of research I found that the `build` directory *should* have been pointing at a directory holding the Linux header files, so my first thought was that I made an error when running the `make headers_install` command during the kernel compilation process. This turned out to be profoundly incorrect, but still - it started the problem solving process.

## Linux Header Files
Generally speaking, Linux Header files are a sort of API for the Linux Kernel. They provide a way for userspace applications to interact with and make use of kernel resources.

My only exposure to the header files up to this point was during the kernel compilation process, so that's where I started. I found the [documentation][1] for the `headers_install` command, which included the following information:
```
Exporting kernel headers for use by userspace
=============================================
The "make headers_install" command exports the kernel's header files in a form suitable for use by userspace programs.
...
The system's libc headers are usually installed at the default location /usr/include...
```
Ok so...we're making progress. I confirmed that I installed the header files properly based on the official kernel documentation and I checked on my Orange Pi Zero3 and found that the header files were, in fact, present in `/usr/include` so...why wasn't it working?

On a whim, I decided to check where the `build` symlink pointed to on a (to my knowledge) fully functioning Linux system: my raspberry pi. Here, when I checked the symlink for `build` it actually pointed to `/usr/src/{Kernel Version}`. "Ok", I thought, "so I just need to point the symlink at /usr/src/ on my Zero3". Before updating the symlink I decided to check what was in `/usr/src/` on my Zero3 and found...nothing.

{{< image src="/images/linux-headers-for-orange-pi-zero3/still_confused.jpg"  alt="A different confused guy" width="450px" >}}
{{< /image >}}

At this point I figured I was either losing my mind or the Linux Kernel developers were conspiring against me to pull off a pretty awesome prank.

After a lot more research, I found out that I had already somewhat found the answer. Going back to the kernel documentation, the term "userspace" comes up several times. As it turns out this is a very important distinction when discussing Linux headers, because in our case we wanted the kernel-space headers.

The distinction is frustratingly simple. It would be dangerous to give userspace applications an API with full access to the kernel resources and systems. However, when we're writing kernel-level modules, we *need* that access. The solution is to put a limited API in `/usr/include` and a far more comprehensive one in `/usr/src`.

## So...How do I make kernel space headers?
I found the answer in an old [Stackoverflow][2] post. The mainline Linux repo makefile has a recipe for `deb-pkg`. According to the help information (`make help | grep deb-pkg`), the recipe builds both the source and binary deb kernel packages. I still had my `linux/` directory set up from when I originally compiled the kernel for my Zero3. Navigating back into `linux/`, I ran this command:
```
make deb-pkg
```
...and was immediately met with an error because I was missing dependencies. This will likely depend on your system, but I had to install two libraries in order to successfully run the recipe:
```
sudo apt-get install debhelper-compat=12 libelf-dev
```
*Note: If you bootstrapped your rootfs with a non-deb build, you may need to use a different recipe. Check the `Kernel packaging` section in the output from running `make help`.*

After running the recipe, a `debian/` directory is made within the Linux directory, which includes a directory titled `linux-headers-{kernel version}/`. After a bit more digging I located the linux kernel header files at the following path:
```
debian/linux-headers-{kernel version}/usr/src/
```
I moved the directory located in the `src/` directory to the `/usr/src` directory on my Zero3's rootfs, fixed the `build` symlink to point to it, and that was it! Problem solved.

Given the importance of these header files for module development, I would have thought this would be a built-in step during the original kernel compilation process. I was surprised that there wasn't much mention of it in any of the documentation I found, but that's a problem for another day.

Anyways - hopefully you found this helpful. Thanks for reading!

[1]: https://www.kernel.org/doc/Documentation/kbuild/headers_install.txt
[2]: https://stackoverflow.com/questions/19486335/how-to-extract-kernel-headers-for-compiling-kernel-module-later