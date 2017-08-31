![Demo](https://robo54.com/assets/create-react-video.gif?demo)

<h6 align="center">
  This is a work in progress.
  <a href="https://robo54.com/blog/create-react-video">See the demo here</a>.
</h6>

You may have seen those short informational videos on Facebook, such as this one by the [World Economic Forum](https://facebook.com/worldeconomicforum/videos/10154714897226479/).

I find it to be a very engaging way of presenting information. The visual components that are in the video are basic and can be mimicked with HTML and CSS. They are then reused along the video with different text.

Most video editing software has a lot of features that are not needed to accomplish this type of video. They usually have a bit of a learning curve and it's not always easy to reuse work between projects.

I decided to implement a way of coding videos using React by forking "Create React App", a project that makes it easy to develop a web page using React. While in Create React App running `yarn start` opens a browser tab that refreshes when you update your code, Create React Video opens a video player, built with Electron, that also reloads when you update the code.

You can see a very raw example video [here](https://vimeo.com/davidfrancisco/create-react-video) and the code to generate it [here](https://gist.github.com/97869b042bd2b1002c0fa2ed8fecbec5).

While the animations are very basic, there's a lot more you can do with CSS. You can also use canvas and do more advanced animations and transitions.

This is just the beginning. There are some bugs, lots of limitations, and room for improvement.

---

### Quick Overview

To try Create React Video you can install the main package globally and run the generator:

```
npm install --global create-react-video
create-react-video my-video
```

Or, if you are a user of Create React App, you can use that instead and avoid installing the extra global package:

```
create-react-app my-video --scripts-version @robo54/react-scripts
```

You may get a `file already exists, symlink Versions/Current/Electron` but everything should still work as expected.

Additional notes:

- For the export to work you need to have a recent version of **ffmpeg installed on your system**.
- **Only macOS is supported** at the moment.
- **You’ll need to have Node >= 6 on your machine**. You can use [nvm](https://github.com/creationix/nvm#installation) to easily switch Node versions between different projects.
