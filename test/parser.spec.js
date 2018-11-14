/* eslint-env jest */
const { compileAndExec, compileToJSON } = require("../src").default;

describe("HJSON PARSER", () => {
  const q = `$compose
  $count
    users
      $filter!
        name.first!
          $eq 'Anne'
  $gt 0
`;

  test("Should interpret HJSON syntax", () => {
    const json = compileToJSON(q);

    expect(json).toMatchObject({
      $compose: [
        {
          $count: {
            users: {
              $debug: true,
              $filter: {
                $debug: true,
                "name.first": {
                  $eq: "Anne"
                }
              }
            }
          }
        },
        {
          $gt: 0
        }
      ]
    });
  });

  test("Should output well-formed JSON form", () =>
    expect(compileAndExec(q, { users: [{ name: { first: "Anne" } }] })).toEqual(
      true
    ));
});
