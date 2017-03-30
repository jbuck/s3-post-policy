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
      ["eq", "$Content-Type", "image/png"],
      ["starts-with", "$key", "user/user1/"],
      ["starts-with", "$x-amz-meta-tag", ""],
      ["content-length-range", 1, 1000000],
      {"x-amz-meta-uuid": "14365123651274"}
    ]
  }
});

console.log(JSON.stringify(output, null, 4));
