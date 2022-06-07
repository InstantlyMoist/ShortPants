exports.lightOrange = "#FFC888";
exports.darkOrange = "#DE6323";
exports.lightBlue = "#BCCBD8";
exports.darkBlue = "#195F82";

exports.lightColor = function(shortPants) {
    return shortPants ? exports.lightOrange : exports.lightBlue;
}

exports.darkColor = function(shortPants) {
    return shortPants ? exports.darkOrange :  exports.darkBlue;
}