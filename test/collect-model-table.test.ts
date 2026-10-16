import { collectModelTable, collectModels } from "../app/utils/model";
import { DEFAULT_MODELS } from "../app/constant";

describe("collectModelTable", () => {
  test("includes the built-in models keyed by name@providerId", () => {
    const table = collectModelTable(DEFAULT_MODELS, "");
    const qwen = table["qwen3.7-plus@alibaba"];
    expect(qwen).toBeDefined();
    expect(qwen.available).toBe(true);
    expect(qwen.name).toBe("qwen3.7-plus");
    expect(qwen.displayName).toBe("qwen3.7-plus");
  });

  test("'-all' marks every model as unavailable", () => {
    const table = collectModelTable(DEFAULT_MODELS, "-all");
    expect(Object.values(table).every((m) => m.available === false)).toBe(true);
  });

  test("disabling a single model leaves the others available", () => {
    const table = collectModelTable(DEFAULT_MODELS, "-qwen3.7-plus@alibaba");
    expect(table["qwen3.7-plus@alibaba"].available).toBe(false);
    expect(table["qwen3.8-max@alibaba"].available).toBe(true);
  });

  test("adds a brand-new custom model with an explicit provider", () => {
    const table = collectModelTable(DEFAULT_MODELS, "+my-model@myorg");
    const custom = table["my-model@myorg"];
    expect(custom).toBeDefined();
    expect(custom.available).toBe(true);
    expect(custom.displayName).toBe("my-model");
  });

  test("honours a custom display name via name=displayName syntax", () => {
    const table = collectModelTable(DEFAULT_MODELS, "+my-model@myorg=Shiny");
    expect(table["my-model@myorg"].displayName).toBe("Shiny");
  });
});

describe("collectModels", () => {
  test("returns one entry per row of the model table", () => {
    const table = collectModelTable(DEFAULT_MODELS, "");
    const models = collectModels(DEFAULT_MODELS, "");
    expect(models).toHaveLength(Object.keys(table).length);
  });

  test("contains the built-in qwen3.7-plus model", () => {
    const models = collectModels(DEFAULT_MODELS, "");
    expect(models.some((m) => m.name === "qwen3.7-plus")).toBe(true);
  });
});
