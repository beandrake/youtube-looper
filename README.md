# youtube-looper
A web app that loops YouTube videos without ads.  Includes the ability to save a video list for convenient access without a YouTube login.

#### Table of Contents ####
- [Features](#features)
- [Why does this exist?](#why-does-this-exist)
- [Running the app](#running-the-app)

## Features ##
- Play a single YouTube video on repeat without ads.
- Curate a video list for quick access.
- Optionally give each video a custom label.
- Save your video list, then load it later.
- No cookies or tracking, and no accounts necessary.

## Why does this exist? ##
In the beginning, I just wanted to listen to a single song on repeat.  I found the song on YouTube, but YouTube's interface doesn't include the ability to automatically repeat a video. I did some research and found that oddly enough, it was possible to loop YouTube videos, but it required using an iframe. I wrote the simple HTML to make an iframe, spun up a local Python web server to run it, and I was satisfied for awhile.

But periodically I would get the desire to switch to a different song, and each time I would need to manually extract the video ID from the URL and apply it to the iframe's source URL. So decided to make an interface that would automate most of that process. Over time I kept repeating that pattern of finding a pain point, researching solutions, and implementing a new feature, and soon enough I had a CRUD app with a playlist that I was making use of on a daily basis.

I've really enjoyed the process of making something I regularly use, and I've learned a lot in the process.

## Running the app ##
If you'd like to run this app locally, here's one way to do that on Windows:

1. You'll need [git](https://git-scm.com/), which will allow you to make a local clone of this repository via your [preferred method](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

2. You'll also need some way to run a simple local server; I've been using [Python](https://www.python.org/downloads/), so that's what I'll use in these instructions.

3. In the directory of your local clone, open a command prompt and run the following to start a local server:

       start python -m http.server 8000

4. Now you can open the app by pasting this URL into your web browser:

       http://localhost:8000/index.html

5. If you make any changes to the app's code, simply reload the webpage and it will restart using your latest code.

If you have [Firefox](https://www.firefox.com/en-US/), you can simply run `launch.bat` to conveniently complete steps 3 and 4.
