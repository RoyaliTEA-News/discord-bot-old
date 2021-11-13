import downloadUrl from "download";
import gitclone from "git-clone";
import rimraf from "rimraf";

const rm = rimraf.sync;

export = function download(repo, dest, opts, fn) {
  if (typeof opts === "function") {
    fn = opts;
    opts = null;
  }

  opts = opts || {};

  const clone = opts.clone || false;
  delete opts.clone;

  repo = normalize(repo);
  const url = repo.url || getUrl(repo, clone);

  if (clone) {
    const cloneOptions = {
      checkout: repo.checkout,
      shallow: repo.checkout === "master",
      ...opts
    };

    gitclone(url, dest, cloneOptions, function (err) {
      if (err === undefined) {
        rm(dest + "/.git");
        fn();
      } else fn(err);
    });
  } else {
    const downloadOptions = {
      extract: true,
      strip: 1,
      mode: "666",
      ...opts,
      headers: {
        accept: "application/zip",
        ...(opts.headers || {})
      }
    };

    downloadUrl(url, dest, downloadOptions)
      .then(() => fn())
      .catch(fn);
  }
}

function normalize(repo) {
  let regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/,
    match = regex.exec(repo);

  if (match) {
    const url = match[2],
      directCheckout = match[3] || "master";

    return {
      type: "direct",
      url: url,
      checkout: directCheckout
    };
  } else {
    regex = /^(?:(github|gitlab|bitbucket):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/;
    match = regex.exec(repo);
    var type = match[1] || "github",
      origin = match[2] || null,
      owner = match[3],
      name = match[4],
      checkout = match[5] || "master";

    if (origin == null) {
      if (type === "github") origin = "github.com";
      else if (type === "gitlab") origin = "gitlab.com";
      else if (type === "bitbucket") origin = "bitbucket.org";
    }

    return {
      type: type,
      origin: origin,
      owner: owner,
      name: name,
      checkout: checkout
    };
  }
}

function addProtocol(origin, clone) {
  if (!/^(f|ht)tps?:\/\//i.test(origin)) {
    if (clone) origin = "git@" + origin;
    else origin = "https://" + origin;
  }

  return origin;
}

function getUrl(repo, clone) {
  let url, origin = addProtocol(repo.origin, clone);

  if (/^git@/i.test(origin)) origin = origin + ":";
  else origin = origin + "/";

  if (clone) url = origin + repo.owner + "/" + repo.name + ".git";
  else {
    if (repo.type === "github") url = origin + repo.owner + "/" + repo.name + "/archive/" + repo.checkout + ".zip";
    else if (repo.type === "gitlab") url = origin + repo.owner + "/" + repo.name + "/repository/archive.zip?ref=" + repo.checkout;
    else if (repo.type === "bitbucket") url = origin + repo.owner + "/" + repo.name + "/get/" + repo.checkout + ".zip";
  }

  return url;
}
