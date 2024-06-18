+++
title = 'State of the Union'
date = 2024-06-17T01:06:53-07:00
draft = false
+++
So it's been a while since my last post. I had a few life things happening and simultaneously got side-tracked from my last project by a new-ish, and rapidly growing, interest in cybersecurity. I've been able to re-focus recently and on the tail of finishing a functional (if somewhat buggy - writing code for a program that relies heavily on async serial communication can be a real pain, so I've learned) version 1.0 of that project, I thought that it would be good to plan out my next steps. Essentially my own personal SOTU speech.

## Cybersecurity
### TryHackMe & Project Ideas
First things first - [TryHackMe][1] is a ton of fun. I've really appreciated the structure used in the courses, and have already earned several certificates 

In learning more about cybersecurity, I've come across [Nmap][2] and [Wappalyzer][3]. I've used Nmap casually for years - usually as a way to quickly scan my network to find whatever SBC I just powered on. Little did I know how powerful and vital it is when conducting a CTF/pen-test/etc. Wappalyzer is a browser plugin that provides insight into the services (front and back-end) that are running on a given website. Again - very handy for pen-testing and the like.

Now, reinventing the wheel is probably not a great business idea, but I do subscribe to the "to learn it, do it" school of learning. As such, I plan to recreate a limited Nmap knock-off with Python (the original is written in C). This will give me a chance to work directly with TCP handshakes, play with Python multi-threading and async functionality, and also get familiar with socket programming in Python too.

For the Wappalyzer knock-off, I'm thinking I'll either user JavaScript + Python, or JavaScript + Rust. I've never really used Rust, and I'm cautious of biting off more than I can chew here, so I'll need to do a tad more research before committing to one or the other. Also, for this to be a browser extension (even a limited one), it will need to be partially in JavaScript. I'll need to figure out if it would be worth it to have a back-end/server running Python or Rust to do the legwork or if it should be pure JavaScript. Lots of TBDs for this one, but I'm excited to dig into it.

### Certificates, Certifications, and more
TryHackMe has a great system for teaching cybersecurity concepts, but in looking online I saw that the certificates you get for completing their courses are not something people recommend to include on your resume. This led me down the 'certificate vs. certification' rabbithole. There is a difference, though if I'm being honest the two main ones so far appear to be reputation in the industry and cost.

Regardless, the Google Cybersecurity Certificate was a great learning opportunity and I'm glad I did it. While it may 'only' be acertificate, I walked away from it with a nice foundational understanding of a lot of cybersecurity concepts. I needed to start somewhere, and this was a nice way to do it. At no point did I feel like I'd been dropped into the deep end, and there were labs/quizzes/assignments along the way that were helpful in reinforcing the concepts. I give it a solid 5/5 stars.

In terms of goals here, I plan to keep going with the TryHackMe courses and start tackling the CTFs as an additional challenge to compliment the courses on SOC/pen-testing/etc. I'm currently in the top 5% of users but my goal is to break into the top 2%. Why not, right?

I'm also going to go for either the [Sec+][4] certification, the [eJPT][5], or the [HackTheBox CPTS][6], but I'm leaning towards the CPTS at this point. From what I've read online, it doesn't have the same industry recognition as the Sec+ (yet), but is a fantastic course/exam for learning practical Pen-testing skills. There's the added bonus that HackTheBox also offers a similar SOC course/exam which I could dabble with at the same time.

### Homelab
Though my list of objectives is already getting lengthy, I'm also going to tack on the creation of a budget homelab using my raspberry pi. I'm not sure what this will entail, but I want hands on experience with common cybersecurity tools (I'm looking at you, Suricata and Splunk). I'm not sure how practical the Raspberry Pi 4b will be for this, but at the moment it's collecting dust so I'm going to put that thing to work (and keep a fire extinguisher on-hand in case I push it too far).

### To-Do List
So, with all that said, my objectives for the short-term are:
1. Achieve top 2% on TryHackMe
2. Write a Python-based Nmap-esque tool
3. Write a JS/Python/Rust-based Wappalyzer-esque tool
4. Get my CPTS from HackTheBox
5. Make a Homelab

Thanks for reading. Stay tuned for more updates soon!

-Wil

[1]: https://tryhackme.com/
[2]: https://nmap.org/
[3]: https://www.wappalyzer.com/
[4]: https://www.comptia.org/certifications/security
[5]: https://security.ine.com/certifications/ejpt-certification/
[6]: https://www.hackthebox.com/blog/certified-penetration-testing-specialist-cpts
