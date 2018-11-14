/* eslint-env jest */
const { exec } = require("../src").default;

describe("DEF", () => {
  test("identity", () => {
    let result = exec(1);
    expect(result).toEqual(1);
    result = exec("a");
    expect(result).toEqual("a");
    result = exec(true);
    expect(result).toEqual(true);
    result = exec(false);
    expect(result).toEqual(false);
  });

  test("equality", () => {
    // Notice the lack of a field here. Using composition, we can set values
    // going forward
    const result = exec({ $compose: [1, { $eq: 1 }] });
    expect(result).toEqual(true);
  });
});

describe("LESS THAN", () => {
  test("resolves", () => {
    const result = exec({ $lt: 2 }, 0);
    expect(result).toBe(true);
  });

  test("fails", () => {
    const result = exec({ $lt: -1 }, 0);
    expect(result).toBe(false);
  });
});

describe("GREATER THAN", () => {
  test("resolves", () => {
    const result = exec({ $gt: 1 }, 3);
    expect(result).toBe(true);
  });

  test("fails", () => {
    const result = exec({ $gt: 2 }, 1);
    expect(result).toBe(false);
  });
});

describe("EQUAL", () => {
  test("resolves", () => {
    const result = exec({ $eq: 2 }, 2);
    expect(result).toBe(true);
  });

  test("fails", () => {
    const result = exec({ $eq: -1 }, 1);
    expect(result).toBe(false);
  });

  test("resolves binary queries", () => {
    const result = exec({ $eq: [{ $get: "value" }, 2] }, { value: 2 });
    expect(result).toBe(true);
  });

  test("fails binary queries", () => {
    const result = exec(
      { $eq: [{ $get: "value" }, { $set: 4 }] },
      { value: 2 }
    );
    expect(result).toBe(false);
  });
});

describe("NOT EQUAL", () => {
  test("resolves", () => {
    const result = exec({ $neq: 2 }, 0);
    expect(result).toBe(true);
  });

  test("fails", () => {
    const result = exec({ $neq: 2 }, 2);
    expect(result).toBe(false);
  });
});

describe("CONTAINS", () => {
  test("resolves", () => {
    const result = exec({ $contains: 2 }, [1, 2, 3]);
    expect(result).toBe(true);
  });

  test("fails", () => {
    const result = exec({ $contains: -1 }, [1, 2, 3]);
    expect(result).toBe(false);
  });
});

describe("HAS", () => {
  test("resolves", () => {
    const result = exec({ $has: "name" }, { name: "Bob" });
    expect(result).toBe(true);
  });

  test("fails", () => {
    const result = exec({ $has: "name" }, [1, 2, 3]);
    expect(result).toBe(false);
  });
});

describe("OR", () => {
  test("resolves", () => {
    const result = exec(
      {
        $or: [{ $eq: "test" }, { $eq: "tester" }]
      },
      "test"
    );

    expect(result).toBe(true);
  });

  test("resolves - nested", () => {
    const result = exec(
      {
        $or: [
          { name: { first: { $eq: "Jim" } } },
          { name: { first: { $eq: "Tim" } } }
        ]
      },
      { name: { first: "Tim" } }
    );

    expect(result).toBe(true);
  });

  test("fails", () => {
    const result = exec(
      {
        $or: [{ $eq: "test" }, { $eq: "tester" }]
      },
      "tets"
    );

    expect(result).toBe(false);
  });
});

describe("AND", () => {
  test("resolves", () => {
    const result = exec(
      {
        $and: [{ $lt: 20 }, { $gt: 5 }]
      },
      12
    );

    expect(result).toBe(true);
  });

  test("fails", () => {
    const result = exec(
      {
        $and: [{ $lt: 20 }, { $gt: 50 }]
      },
      12
    );

    expect(result).toBe(false);
  });
});

describe("SET", () => {
  test("resolves - simple", () => {
    const result = exec({ $set: 2 }, 1);
    expect(result).toBe(2);
  });

  test("resolves - nested literal with ambiguous keys", () => {
    const field = { model: { value: "some value" } };
    const result = exec(
      {
        $set: {
          model: {
            $set: {
              value: "another value",
              model: {
                $set: {
                  model: { $get: "model.value" },
                  // The `model` key above is wrapped in a `$set` and this `value`
                  // is also wrapped in a `$set`, meaning that neither one functioned
                  // as an _implicit_ `$get`. Both of those keys are considered (and, indeed, are)
                  // part of the output structure. This is why `$get: 'model.value'` is
                  // used here since there was no refinement of the `field`
                  value: { $get: "model.value" },
                  someOtherKey: {
                    // Since this isn't wrapped in $set, the model resolves regularly
                    model: { $get: "value" }
                  }
                }
              }
            }
          }
        }
      },
      field
    );

    expect(result).toEqual(
      expect.objectContaining({
        model: expect.objectContaining({
          value: expect.stringMatching("another value"),
          model: expect.objectContaining({
            value: expect.stringMatching("some value"),
            model: expect.stringMatching("some value"),
            someOtherKey: expect.stringMatching("some value")
          })
        })
      })
    );
  });

  test("resolves - object", () => {
    const result = exec(
      { name: { $set: { firstName: { $get: "first" } } } },
      { name: { first: "Jimmy", last: "Doo-dah" } }
    );
    expect(result).toHaveProperty("firstName", "Jimmy");
  });
});

describe("GET", () => {
  test("no-op", () => {
    const result = exec({ $get: "value" }, { test: true });
    expect(result).toBeNull();
  });

  test("resolves", () => {
    const result = exec({ $get: "value" }, { value: 2 });
    expect(result).toBe(2);
  });
});

describe("COMPOSITION", () => {
  test("resolves", () => {
    const result = exec(
      { $compose: [{ $get: "items[0]" }, { $get: "price" }] },
      {
        price: 20,
        items: [{ price: 2 }, { price: 5 }, { price: 3 }, { price: 10 }]
      }
    );

    expect(result).toBe(2);
  });
});

describe("MAP", () => {
  test("resolves", () => {
    const result = exec({ $map: { $set: 2 } }, [1, 2, 3]);
    expect(result).toEqual(expect.arrayContaining([2, 2, 2]));
    result.forEach(v => expect(v).toBe(2));
  });

  test("resolves - flatten and format list", () => {
    const f = {
      users: [
        { firstName: "Abby", lastName: "Johnston" },
        { firstName: "Tim", lastName: "Yolo" },
        { firstName: "Jeremy", lastName: "Keys" },
        { firstName: "Sarah", lastName: "Wells" }
      ]
    };

    const q = {
      users: {
        $set: {
          names: {
            $map: {
              $concat: [{ $get: "lastName" }, ", ", { $get: "firstName" }]
            }
          }
        }
      }
    };

    const result = exec(q, f);
    expect(result).toMatchObject({
      names: ["Johnston, Abby", "Yolo, Tim", "Keys, Jeremy", "Wells, Sarah"]
    });
  });

  test("resolves - reformat list", () => {
    const result = exec(
      {
        people: {
          $map: {
            $set: {
              name: { $get: "name" },
              age: { $get: "yearsOld" }
            }
          }
        }
      },
      {
        people: [{ name: "Jane", yearsOld: 45 }, { name: "Bob", yearsOld: 32 }]
      }
    );

    expect(result).toHaveLength(2);

    expect(result[0]).toMatchObject({
      name: "Jane",
      age: 45
    });

    expect(result[1]).toMatchObject({
      name: "Bob",
      age: 32
    });
  });
});

describe("FILTER", () => {
  test("no-op", () => {
    const field = [{ value: 15 }, { value: 20 }, { value: 30 }];
    const result = exec({ $filter: { value: { $gt: 10 } } }, field);

    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(field));
  });

  test("resolves", () => {
    const field = [{ value: 15 }, { value: 20 }, { value: 30 }];
    const result = exec({ $filter: { value: { $gt: 10 } } }, field);
    expect(Array.from(result)).toHaveLength(3);
    expect(Array.from(result)).toEqual(expect.arrayContaining(field.slice(1)));
  });
});

describe("CONCAT", () => {
  test("resolves", () => {
    const result = exec(
      {
        $concat: [{ $set: "a" }, { $set: "b" }, { $get: "c" }]
      },
      { c: "C" }
    );

    expect(result).toEqual("abC");
  });

  test("resolves - conditional concatenation", () => {
    let result;

    const form = {
      $concat: [
        {
          $or: [
            {
              $and: [
                { $has: "lastName" },
                { $concat: [{ $get: "lastName" }, ", "] }
              ]
            },
            ""
          ]
        },
        { $get: "firstName" }
      ]
    };

    result = exec(form, {
      firstName: "test",
      lastName: "testerson"
    });

    expect(result).toEqual("testerson, test");

    result = exec(form, { firstName: "test" });

    expect(result).toEqual("test");
  });
});

describe("COUNT", () => {
  test("resolves - with filter (array)", () => {
    const field = [10, 15, 20, 25, 30];
    const result = exec({ $count: { $filter: { $gt: 20 } } }, field);
    expect(result).toEqual(2);
  });

  test("resolves - simple (object)", () => {
    const field = { firstName: "Jimmy", lastName: "twoTone" };
    const result = exec(
      { $count: { $keys: { $filter: { $ne: null } } } },
      field
    );
    expect(result).toEqual(2);
  });
});

describe("INTERFACE", () => {
  const vars = { _formatDate: (form, field) => "12 Dec 1990" };

  test("resolves - valid string", () => {
    const field = "1990-12-12";
    const result = exec({ _formatDate: "D MMM Y" }, field, vars);
    expect(result).toEqual("12 Dec 1990");
  });

  test("resolves - with $get", () => {
    const field = { date: "1990-12-12" };
    const result = exec({ date: { _formatDate: "D MMM Y" } }, field, vars);
    expect(result).toEqual("12 Dec 1990");
  });
});

describe("$eval", () => {
  test("execute dynamic form", () => {
    const q = {
      $eval: {
        $concat: [
          "{",
          '$set: "',
          { "users[0]": { $get: "name.first" } },
          '"',
          "}"
        ]
      }
    };
    const f = {
      users: [{ name: { first: "jim" } }, { name: { first: "mary" } }]
    };
    // Adds the indices of a list value
    const result = exec(q, f);
    expect(result).toEqual("jim");
  });
});

describe("REGEX", () => {
  test("no flags", () => {
    const result = exec(
      {
        $regex: "/test/"
      },
      "test"
    );

    expect(result.length).toEqual(0);
  });

  test("case-insensitive", () => {
    const result = exec(
      {
        $regex: "/test/i"
      },
      "TEST"
    );

    expect(result.length).toEqual(0);
  });

  test("groups", () => {
    const result = exec(
      {
        $regex: "/test ([a-z]+)/i"
      },
      "test TEST"
    );

    expect(result).toEqual(expect.arrayContaining(["TEST"]));
    expect(result.length).toEqual(1);
  });

  test("fails (case-insensitive)", () => {
    const result = exec(
      {
        $regex: "/test/"
      },
      "TEST"
    );

    expect(result).toBe(null);
  });

  test("fails (from input)", () => {
    const result = exec(
      {
        $regex: "/test/"
      },
      {}
    );

    expect(result).toBe(null);
  });
});

describe("COMPOUND - AND", () => {
  test("and with $eq", () => {
    const result = exec(
      {
        $and: [{ first: { $eq: "test" } }, { last: { $eq: "testerson" } }]
      },
      { first: "test", last: "testerson" }
    );

    expect(result).toBe(true);
  });
});

describe("Filter object keys with count", () => {
  const field = {
    location: true,
    patient: true,
    "patient[0].name": "Jimmy Twotone",
    "patient[1].name": "Jill Jenkins",
    "patient[3].name": "Test Testerson"
  };

  const form = {
    $count: {
      $keys: {
        $filter: {
          $regex: "/patient\\[\\d+\\]/"
        }
      }
    }
  };

  const result = exec(form, field);
  expect(result).toEqual(3);
});

describe("Should follow relative paths", () => {
  const field = {
    location: true,
    hasPatients: true,
    patients: {
      patient: [
        { name: "Jimmy Twotone" },
        { name: "Jill Jenkins" },
        { name: "Test Testerson" }
      ]
    }
  };

  const form = {
    "patients.patient[0]": {
      $and: [
        { name: { $eq: "Jimmy Twotone" } },
        { "../patients.patient[1].name": { $eq: "Jill Jenkins" } },
        { "../patients.patient[2].name": { $eq: "Test Testerson" } },
        { $set: "Matched!" }
      ]
    }
  };

  const result = exec(form, field);
  expect(result).toEqual("Matched!");
});
