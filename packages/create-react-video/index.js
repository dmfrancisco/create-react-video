require("npm-run").spawnSync(
  "create-react-app",
  [process.argv[2], "--scripts-version", "@robo54/react-scripts"],
  { stdio: "inherit" }
);
