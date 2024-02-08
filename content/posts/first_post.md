+++
title = 'Setting up an SDK for the ESP-01/ESP8266'
date = 2024-02-08T11:49:23-08:00
draft = false 
type = "post"
+++

# ESP-OPEN-SDK on the Raspberry Pi 4B
## Table of Contents
1. [Introduction](#introduction)
2. [My Environment](#my-environment)
3. [Espressif's Official SDK](#espressifs-official-sdk)
4. [Enter the ESP-OPEN-SDK](#enter-the-esp-open-sdk)
5. [Fix the Bash version issue](#fix-the-bash-version-issue)
6. [Fix the ISL Library URL](#fix-the-isl-library-url)
7. [Fix the Expat Version](#fix-the-expat-version)
8. [Fix a GCC/C++ compatability issue](#fix-a-gcccpp-compatability-issue)
9. [Fix a Python internal API issue](#fix-a-python-internal-api-issue)
10. [Fix the esptool.py issue](#fix-the-esptool-issue)
11. [C'est Fini!](#cest-fini)
12. [Notes](#notes)


## Introduction
Lately I've been focusing on honing my skills as a developer, both in coding but also in my development environment. As a result, I write/compile/test code almost entirely on Linux VMs or my RPi via the command line (and command line tools).

I've had a few spare ESP-01s lying around and finally have a need for them, so I figured it was time to set up the Espressif SDK and try my hand at developing some specialized/limited firmware for them. 

This proved to be more challenging then I originally hoped, and I thought it might be helpful to store the issues (and fixes!) in one place. So - here we are!

## My Environment
These instructions have been tried and tested on a Raspberry Pi Model 4B running Debian/Bookworm (Aarch64).

## Espressif's Official SDK
I figured the best place to start would be the official SDK. I followed the toolchain setup and installation guide, but when I tried making the example blinky script I was immediately greeted with a strange, vague error about a misplaced parantheses.

My first thought was that I had messed something up (always possible) during the installation of the toolchain or when adding the necessary tools to my system's PATH. On some more digging, though, I discovered that the SDK and its toolchain were compiled for x86 systems, not Arm/Aarch64. This doesn't seem to be noted anywhere in the Espressif documentation.

What followed was rabbit hole after rabbit hole of attempts to compile the source of the error - the xtensa-lx106-elf toolchain - for Aarch64. This involved attempts at using Espressif's version of crosstool-NG and encountering different errors as a result of gcc versioning conflicts with other parts of the official SDK.

While I'm sure someone with more experience building/using toolchains of this kind could figure it out, I figured I might be better off trying a different approach if I ever wanted to use the ESP01 with my projects (unless I wanted to completely throw in the towel and buy an x86 laptop).

## Enter the ESP-OPEN-SDK
In my research, I noticed that there were several posts about using the esp-open-sdk on Raspberry Pis. After hours of researching, compiling, fixing errors, and finding new ones, I was ready to try something new.

Because the repo is unmaintained, and many of the tools are quite dated, I needed to make some updates. Luckily I'm not the first person to try to deal with this issue in 2024 so I was able to stand on the shoulders of giants.

What follows is a compilation of solutions found and developed by members of the open source community for successfully building the esp-open-sdk. I've included links/references to the original solutions at the end of this post.

Once you've cloned the esp-open-sdk repo onto your system, you'll need to make the following updates to the included files.

### Fix the Bash version issue
There's a good chance your system is using a newer version of Bash (e.g. version 5 instead of 3.1).

While in ```/esp-open-sdk```, navigate to ```/crosstool-NG``` and edit the ```configure.ac``` file.

Navigate to line 193. ```$EGREP '^GNU bash, version (3\.[1-9]|4)')``` needs to be updated to include your system's version of Bash. For me, this was version 5, so: ```$EGREP '^GNU bash, version (3\.[1-9]|4|5)')```.

### Fix the ISL library URL
The link used by crosstool-NG to download the ISL library is outdated/broken. You have two options: 
1) download the correct ISL version tarball yourself and slot it into ```.build/tarballs/``` manually, or 
2) fix the URL in 121-isl.sh.

For the latter, navigate to ```esp-open-sdk/crosstool-NG/scripts/build/companion_libs``` and edit the link at line 17 to ```https://libisl.sourceforge.io``` instead of ```http://isl.gforge.inria.fr```.

### Fix the Expat version
Somewhere along the line, a vulnerability was found in the version of the expat library used with esp-open-sdk. The URL itself works, but the name of the file has changed to reflect the vulnerability. You can either: 
1) fix the URL to reflect the name change and download version 2.1.0 of the tool, or 
2) fix the script to use a version of Expat that addresses the vulnerability. 

If you choose the latter option, navigate to ```esp-open-sdk/crosstool-NG/config/companion_libs``` and open ```expat.in```. Update line 19 from ```default "2.1.0" if EXPAT_V_2_1_0``` to ```default "2.5.0" if EXPAT_V_2_1_0```.

### Fix a GCC/C++ compatability issue
Once the Bash and URL/version issues have been fixed, you'll likely encountered a cpp related error in reload1.c during your first attempt to build the SDK. Specifically, there is an issue with how a variable is being incremented.

Navigate to ```esp-open-sdk/crosstool-NG/.build/src/gcc-4.8.5/gcc``` and open reload1.c. At line 443, update ```spill_indirect_levels++;``` to ```spill_indirect_levels = 1;```.

Note: this seemed odd to me, as the updated code doesn't increment anything but instead just sets the variable to 1. I haven't dug into the code enough to know if this matters, and the fix seems to work, so for now I'm leaning towards the 'If it ain't (still) broken, don't fix it' camp.

### Fix a Python internal API issue
From what I could gather in various Github Issues comment chains, this error arose from an update in Python itself and not the SDK. Specifically, the crosstool-NG was using an internal-only API in Python that at some point became absolutely not-ok to use.

While all of the fixes so far could be performed using a patch file(s), the changes have been short enough that doing them manually isn't too much trouble. Not so with this one. Several changes are required, and I recommend using Chris MacGregor's .patch file [here][python-fix].

You might need to update the file paths in the .patch file to work with your system.

### Fix the esptool.py issue
Once you've successfully built the esp-open-sdk there is still one thing you will likely need to fix. The version of esptool.py (the script used for interacting with the ESP8266) included in the SDK is very old and actually relies on Python2. I've seen some workarounds and methods for updating the tool in the SDK itself, but my favourite and least intrusive fix is to use a virtual environment, then installing esptool.py via pip. I ran the following commands:
- ```python -m venv myvenv```
- ```source myvenv/bin/activate```
- ```pip install esptool.py```

You'll need to make sure you've activated your venv whenever you want to use the esptool.py script, but so far the fix seems to be working seemlessly with the SDK.

### C'est Fini!
And you should be good to go! If you're still encountering errors, my suggestions would be:
- Reviewing the issues on the esp-open-sdk repo. While it's not maintained, there is still an active enough userbase that issues are added and solutions proposed.
- [Reviewing Chris MacGregor's fork][Chris-MacGregor-Link]
- [Reviewing Andrei Gavrila's notes][Andrei-Gavrila-Link]

These were lifesavers in my efforts - hopefully they are for you as well!

### Notes
If you found this post part-way through setting up the SDK, I highly suggest cloning a fresh version of the repo and starting from scratch. 

In my own attempts I discovered that, for reasons beyond my current understanding, crosstool-NG actually duplicates the .in and .sh files in a subdirectory and uses those copies when compiling/building the toolchain. This meant that my updated URL/Expat version weren't actually being used by the version of crosstool-NG trying to build xtensa-lx106-elf. Quite puzzling until I managed to grep and locate the duplicates. Anyways - save yourself a headache and start from scratch would be my advice. Cheers!

[python-fix]: https://github.com/ChrisMacGregor/esp-open-sdk/blob/builds-on-Ubuntu-21.10/1000-fix-build-python3.9.patch "Link to patch file for Python version issue"
[Chris-MacGregor-Link]: https://github.com/ChrisMacGregor/esp-open-sdk/tree/builds-on-Ubuntu-21.10 "Link to Chris MacGregor's fork"
[Andrei-Gavrila-Link]: https://github.com/andrei-gavrila/notes/blob/main/ESP8266-remote-development-esp-open-sdk-esp-open-rtos-HomeKit-on-Raspberry-Pi-from-Mabcook.md "Link to Andrei Gavrila's Notes"
