function decodeToken(accessTokenIn) {

    if (!accessTokenIn || accessTokenIn == 'null') {
        return null;
    }

    var a = accessTokenIn.split(".");
    var uHeader = b64utoutf8(a[0]);
    var uClaim = b64utoutf8(a[1]);

    var pHeader = KJUR.jws.JWS.readSafeJSONString(uHeader);
    var pClaim = KJUR.jws.JWS.readSafeJSONString(uClaim);

    var sHeader = JSON.stringify(pHeader, null, "  ");
    var sClaim = JSON.stringify(pClaim, null, "  ");

    return sClaim;
}
