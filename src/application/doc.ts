import { apiReference } from "@scalar/express-api-reference";
import { web } from "@/application/web";
import packageJSON from "../../package.json";

const title = "Express Starter API Documentation";

const openapiSpec = {
    openapi: "3.0.0",
    info: {
        title: title,
        version: packageJSON.version,
        description: packageJSON.description,
        contact: {
            name: packageJSON.author.name,
            url: packageJSON.author.url,
            email: packageJSON.author.email,
        },
        license: {
            name: "MIT",
            url: "https://github.com/haykal-fe-verd/express-starter?tab=MIT-1-ov-file",
        },
    },
    paths: {},
};

web.get("/openapi.json", (_req, res) => {
    res.json(openapiSpec);
});

web.use(
    "/docs",
    apiReference({
        spec: {
            content: openapiSpec,
        },
        pageTitle: title,
        title,
        theme: "laserwave",
        layout: "classic",
        defaultHttpClient: {
            targetKey: "js",
            clientKey: "fetch",
        },
    })
);
