# s3-post-policy

A POST policy generator for S3 using AWS Signature Version 4

[![Build Status](https://travis-ci.org/jbuck/s3-post-policy.svg)](https://travis-ci.org/jbuck/s3-post-policy)

## Example

```javascript
var policy_gen = require("s3-post-policy");

var policy = policy_gen({
  id: "AKIAIOSFODNN7EXAMPLE",
  secret: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  date: Date.now(),
  region: "us-east-1",
  bucket: "examplebucket",
  policy: {
    expiration: Date.now() + 60 * 1000,
    conditions: [
      {"acl": "public-read"},
      ["starts-with", "$Content-Type", "image/"],
      ["starts-with", "$key", "user/user1/"],
      ["starts-with", "$x-amz-meta-tag", ""],
      {"x-amz-meta-uuid": "14365123651274"}
    ]
  }
});

console.log(policy);
/* Outputs
{
  "fields": {
    "acl": "public-read",
    "Content-Type": "image/",
    "key": "user/user1/",
    "x-amz-meta-tag": "",
    "x-amz-meta-uuid": "14365123651274",
    "bucket": "examplebucket",
    "x-amz-algorithm": "AWS4-HMAC-SHA256",
    "x-amz-credential": "AKIAIOSFODNN7EXAMPLE/20130806/us-east-1/s3/aws4_request",
    "x-amz-date": "20130806T120100Z",
    "policy": "eyJleHBpcmF0aW9uIjoiMjAxMy0wOC0wNlQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W3siYWNsIjoicHVibGljLXJlYWQifSxbInN0YXJ0cy13aXRoIiwiJENvbnRlbnQtVHlwZSIsImltYWdlLyJdLFsic3RhcnRzLXdpdGgiLCIka2V5IiwidXNlci91c2VyMS8iXSxbInN0YXJ0cy13aXRoIiwiJHgtYW16LW1ldGEtdGFnIiwiIl0seyJ4LWFtei1tZXRhLXV1aWQiOiIxNDM2NTEyMzY1MTI3NCJ9LHsiYnVja2V0IjoiZXhhbXBsZWJ1Y2tldCJ9LHsieC1hbXotYWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsieC1hbXotY3JlZGVudGlhbCI6IkFLSUFJT1NGT0ROTjdFWEFNUExFLzIwMTMwODA2L3VzLWVhc3QtMS9zMy9hd3M0X3JlcXVlc3QifSx7IngtYW16LWRhdGUiOiIyMDEzMDgwNlQxMjAwMDBaIn1dfQ==",
    "x-amz-signature": "5bc8a7be4a6fc6445b94d0f4096f8cf3dfa00303529f8a68ea7dc0c23bb83cd9"
  },
  "host": "https://examplebucket.s3.amazonaws.com",
  "starts_with": [
    "Content-Type",
    "key",
    "x-amz-meta-tag"
  ]
}
*/
```

## API

s3-post-policy exports a single function that returns a Object

```
function policy_gen({
  id: "AKIAIOSFODNN7EXAMPLE", // Your AWS key id
  secret: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY", // Your AWS secret key
  date: Date.now(), // The date of the request in any format that "new Date()" can parse
  region: "us-east-1", // The region that is receiving the request
  bucket: "examplebucket", // The bucket that is receiving the request
  policy: {
    expiration: Date.now() + 60 * 1000, // When the request should expire in any format that "new Date()" can parse
    conditions: [
      // An array of valid policy conditions
      // http://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html
    ]
  }
})
```
