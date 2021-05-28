const { S3 } = require("aws-sdk")
const https = require("https")

const source = {
  logo:
    "series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_Logo_HD.png",
  tile:
    "series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_KA_HD.jpg",
  poster:
    "series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_KA_Pstr.jpg",
  wallpaper:
    "series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_KA_HD.jpg"
}

const getSignedURL = async (key) => {
  try {
    const params = {
      Bucket: "wwe-network",
      Key: key
    }

    console.log(`S3 Client Parameters: ${JSON.stringify(params)}`)

    const client = new S3({
      accessKeyId: process.env.FARN_ACCESS,
      secretAccessKey: process.env.FARN_SECRET,
      region: process.env.FS3_BUCKET_REGION
    })
    await client.headObject(params).promise()
    return client.getSignedUrl(
      "getObject",
      Object.assign(params, {
        Expires: parseInt(process.env.FIMG_SIGNED_URL_EXPIRES)
      })
    )
  } catch (error) {
    console.error(`Method: getSignedURL, `, error)
  }
}

const buildImageObject = async (source) => {
  console.log("Source: ", source)
  const images = {}

  for (const k in source) {
    if (k === "logo") {
      source[k] = "laskdf"
    }
    images[k] = await getSignedURL(source[k])
  }

  return images
}

const checkOutbound = async () => {
  console.log("Checking Outbound Calls")
  https
    .get(
      "https://4ooolah8jk.execute-api.us-east-1.amazonaws.com/production/v1/content/TalkRaw1458_Ntwk",
      (res) => {
        console.log("statusCode:", res.statusCode)
        console.log("headers:", res.headers)

        res.on("data", (d) => {
          console.log("Data: ", d)
        })
      }
    )
    .on("error", (e) => {
      console.error(e)
    })
}

exports.handler = async (event, context) => {
  // console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  // await checkOutbound()
  const images = await buildImageObject(source)
  return {
    statusCode: 200,
    body: images
  }
}
