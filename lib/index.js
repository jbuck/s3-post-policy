var aws4_sign = require("aws4-signature");
var clone = require("clone");
var Joi = require("joi");
var url_template = require("url-template");

var s3_host = url_template.parse("https://{bucket}.s3.dualstack.{region}.amazonaws.com");
var s3_regions = [
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-south-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ca-central-1",
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
  "sa-east-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2"
];
var valid_options = Joi.object().keys({
  id: Joi.string(),
  secret: Joi.string(),
  date: Joi.date(),
  region: Joi.string().valid(s3_regions),
  bucket: Joi.string(),
  policy: Joi.object().keys({
    expiration: Joi.date(),
    conditions: Joi.array()
  })
});

module.exports = function policy_gen(options) {
  // Validation options passed in
  var valid = Joi.validate(options, valid_options, {
    presence: "required"
  });

  if (valid.error) {
    throw valid.error;
  }

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
      bucket: options.bucket,
      region: options.region
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
