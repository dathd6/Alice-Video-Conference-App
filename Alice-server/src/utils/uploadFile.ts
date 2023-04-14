import Transloadit from "transloadit";

export const updateInfo = async (file: any) => {
  const transloadit = new Transloadit({
    authKey: process.env.TRANSLOADIT_AUTH_KEY,
    authSecret: process.env.TRANSLOADIT_AUTH_SECRET,
  });

  const robot = "/image/optimize";

  // const preset = "hls-360p";

  let uploads: any = {};
  uploads[`${"avatar or banner"}`] = file;

  try {
    const status = await transloadit.createAssembly({
      // files: {
      //   file1:
      //     "/home/noir/Downloads/2020Thesis-Nghien-Cuu-va-Xay-Dung-he-thong-tro-ly-cuoc-hop.docx",
      // },
      uploads,
      params: {
        steps: {
          // You can have many Steps. In this case we will just resize any inputs (:original)
          resize: {
            use: ":original",
            robot,
            // preset: type === "video" ? preset : null,
            // tubro: type === "video" ? true : null,
            result: true,
            // width: 75,
            // height: 75,
          },
        },
        // OR if you already created a template, you can use it instead of "steps":
        // template_id: 'YOUR_TEMPLATE_ID',
      },
      waitForCompletion: true, // Wait for the Assembly (job) to finish executing before returning
    });

    if (status.results.resize) {
      console.log("file url", status.results.resize[0].ssl_url);
      return status.results.resize[0].ssl_url;
    } else {
      return "";
    }
  } catch (err) {
    console.error("❌ Unable to process Assembly.", err);
    if (err.assemblyId) {
      console.error(
        `💡 More info: https://transloadit.com/assemblies/${err.assemblyId}`
      );
    }
    return "";
  }
};

export const uploadFile = async (file: any, fileName: string, type: string) => {
  const transloadit = new Transloadit({
    authKey: process.env.TRANSLOADIT_AUTH_KEY,
    authSecret: process.env.TRANSLOADIT_AUTH_SECRET,
  });

  const robot =
    type === "video"
      ? "/video/encode"
      : type === "image"
      ? "/image/optimize"
      : "/document/convert";

  // const preset = "hls-360p";

  let uploads: any = {};
  uploads[`${fileName}`] = file;

  let tail = fileName.split(".")[fileName.split(".").length - 1];
  console.log(tail, type);

  try {
    const status = await transloadit.createAssembly({
      // files: {
      //   file1:
      //     "/home/noir/Downloads/2020Thesis-Nghien-Cuu-va-Xay-Dung-he-thong-tro-ly-cuoc-hop.docx",
      // },
      uploads,
      params: {
        steps: {
          // You can have many Steps. In this case we will just resize any inputs (:original)
          resize: {
            use: ":original",
            robot,
            format: type === "application" ? tail : null,
            // preset: type === "video" ? preset : null,
            // tubro: type === "video" ? true : null,
            result: true,
            // width: 75,
            // height: 75,
          },
        },
        // OR if you already created a template, you can use it instead of "steps":
        // template_id: 'YOUR_TEMPLATE_ID',
      },
      waitForCompletion: true, // Wait for the Assembly (job) to finish executing before returning
    });

    if (status.results.resize) {
      console.log("file url", status.results.resize[0].ssl_url);
      return status.results.resize[0].ssl_url;
    } else {
      return "";
    }
  } catch (err) {
    console.error("❌ Unable to process Assembly.", err);
    if (err.assemblyId) {
      console.error(
        `💡 More info: https://transloadit.com/assemblies/${err.assemblyId}`
      );
    }
    return "";
  }
};

export const uploadVideo = async (url: any) => {
  console.log(url);
  const transloadit = new Transloadit({
    authKey: process.env.TRANSLOADIT_AUTH_KEY,
    authSecret: process.env.TRANSLOADIT_AUTH_SECRET,
  });

  const robot = "/video/encode";

  // let blob: any = await fetch(url).then((r) => r.blob());

  // console.log(blob);

  try {
    const status = await transloadit.createAssembly({
      // files: {
      //   file1: url,
      //   // "/home/noir/Downloads/2020Thesis-Nghien-Cuu-va-Xay-Dung-he-thong-tro-ly-cuoc-hop.docx",
      // },
      uploads: {
        video: url,
      },
      params: {
        steps: {
          // You can have many Steps. In this case we will just resize any inputs (:original)
          resize: {
            use: ":original",
            robot,
            // preset: type === "video" ? preset : null,
            // tubro: type === "video" ? true : null,
            preset: "webm",
            tubro: false,
            result: true,
            // width: 75,
            // height: 75,
          },
        },
        // OR if you already created a template, you can use it instead of "steps":
        // template_id: 'YOUR_TEMPLATE_ID',
      },
      waitForCompletion: true, // Wait for the Assembly (job) to finish executing before returning
    });

    if (status.results.resize) {
      console.log("file url", status.results.resize[0].ssl_url);
      return status.results.resize[0].ssl_url;
    } else {
      return "";
    }
  } catch (err) {
    console.error("❌ Unable to process Assembly.", err);
    if (err.assemblyId) {
      console.error(
        `💡 More info: https://transloadit.com/assemblies/${err.assemblyId}`
      );
    }
    return "";
  }
};
