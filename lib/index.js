var aws4_sign = require("aws4-signature");
var clone = require("clone");
var url_template = require("url-template");

var s3_host = url_template.parse("https://{bucket}.s3.amazonaws.com");

module.exports = function policy_gen(options) {
  // Convert the date to the format that AWS uses
  var date_time = new Date(options.date).toISOString().replace(/[:\-]|\.\d{3}/g, "");
  var date = date_time.substr(0, 8);

  // Generate policy
  var policy = clone(options.policy);
  policy.conditions.push({ "bucket": options.bucket });
  policy.conditions.push({ "x-amz-algorithm": "AWS4-HMAC-SHA256"});
  policy.conditions.push({
    "x-amz-credential": options.id + "/" + date + "/" + options.region + "/s3/aws4_request"
  });
  policy.conditions.push({ "x-amz-date": date_time });
  policy.expiration = new Date(policy.expiration).toISOString();

  var base64_policy = new Buffer(JSON.stringify(policy)).toString("base64");
  var signature = aws4_sign(options.secret, options.date, options.region, "s3", base64_policy);

  var output = {
    fields: {},
    host: s3_host.expand({
      bucket: options.bucket
    }),
    starts_with: []
  };

  policy.conditions.forEach(function(p) {
    if (Array.isArray(p)) {
      if (p[0] === "starts-with") {
        output.starts_with.push(p[1].substr(1));
      }
      output.fields[p[1].substr(1)] = p[2];
    } else {
      var key = Object.keys(p)[0];
      output.fields[key] = p[key];
    }
  });
  output.fields.policy = base64_policy;
  output.fields["x-amz-signature"] = signature;

  return output;
};
