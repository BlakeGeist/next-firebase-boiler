function absoluteUrl (req, setLocalhost) {
    var protocol = "https:";
    var host = req ? req.headers.host : window.location.hostname;
    if (host.indexOf("localhost") > -1) {
        if (setLocalhost) host = setLocalhost;
        protocol = "http:";
    }
  
    return {
        protocol: protocol,
        host: host,
        apiURL: `${protocol}//${host}`
    };
}

export default absoluteUrl;