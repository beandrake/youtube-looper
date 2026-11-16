# youtube-looper
A web app that loops YouTube videos without ads.  Includes the ability to save a video list for convenient access without a YouTube login.

#### Table of Contents ####
- [Features](#features)
- [Why does this exist?](#why-does-this-exist)
- [Tips](#tips)
- [Running the app](#running-the-app)
- [Find a bug? Let me know!](#find-a-bug-let-me-know)


## Features ##
- Play a YouTube video on loop without ads.
- Curate a list of your favorite videos for quick access.
- Optionally give each video a custom name.
- Save your video list to a file, then load it later.
- Use the K hotkey to pause and unpause your video.
- No accounts necessary.
- I don't collect or store your data, I don't track you, I don't train on you, etc.
  - Note that this app doesn't prevent YouTube from doing those things!


## Why does this exist? ##
When I'm working on a project, music can really help me get into a flow state. I'll find a song that has the right energy, and I'll just have it playing in the background for hours while I work.

YouTube is a good place to find tracks from shows and video games — which are often well-suited to the task of background music — but the vanilla YouTube experience also comes with a variety of pain points that were diminishing my experience. So I started building my own interface to solve some of that, and over time it's grown into a simple app as I've gradually built more functionality and automation into it for my own convenience. Plus it's just been fun to work on something that I actually make use of on a day-to-day basis.


## Tips ##
- Because this app loads YouTube videos, if you're logged in to YouTube your usage of this app can affect your account's recommendations/algorithm. If you'd prefer to avoid that, try running this app in a private window where you aren't logged in to YouTube.


## Running the app ##
If you'd like to run this app locally, here's one way to do that on Windows:

1. You'll need [git](https://git-scm.com/), which will allow you to make a local clone of this repository via your [preferred method](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

2. You'll also need some way to run a simple local server; I've been using [Python](https://www.python.org/downloads/), so that's the method these instructions will use.

3. In the directory of your local clone, open a command prompt and run the following to start a local server:

       start python -m http.server 8000

4. Now you can open the app by pasting this URL into your web browser:

       http://localhost:8000/index.html

5. If you make any changes to the app's code, simply reload the webpage and it will restart using your latest code.

If you have [Firefox](https://www.firefox.com/en-US/), you can simply run `launch.bat` to conveniently complete steps 3 and 4.


## Find a bug? Let me know! ##

Please open an Issue if you encounter any bugs.

Also, if there are any features you'd like to see, feel free to create an Issue; I can't promise I'll make it, but I'll definitely consider it.