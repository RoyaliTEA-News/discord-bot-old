const config: ClientConfig = {
  ...(!process.argv.includes("--dev") ? {
    token: process.env.TOKEN_MAIN,
    clientId: "",
    database: "RoyaliTEA",
    channels: {
      verify: ""
    }
  } : {
    token: process.env.TOKEN_DEV,
    clientId: "971140835481640991",
    database: "RoyaliTEA-Dev",
    channels: {
      verify: "971140784340475936"
    }
  })
};

Array.prototype.shuffle = function () {
  return this.map((v) => ({ v, i: Math.random() }))
    .sort((a, b) => a.i - b.i)
    .map((v) => v.v);
};

export = config;
