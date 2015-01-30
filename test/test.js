var policy_gen = require("..");

var output = policy_gen({
  id: "AKIAIOSFODNN7EXAMPLE",
  secret: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  date: "2013-08-06T12:00:00.000Z",
  region: "us-east-1",
  bucket: "examplebucket",
  policy: {
    expiration: "2013-08-06T12:00:00.000Z",
    conditions: [
      {"acl": "public-read"},
      ["starts-with", "$Content-Type", "image/"],
      ["starts-with", "$key", "user/user1/"],
      ["starts-with", "$x-amz-meta-tag", ""],
      {"x-amz-meta-uuid": "14365123651274"}
    ]
  }
});

console.log(output);
