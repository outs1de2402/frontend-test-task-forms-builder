import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema.graphql",
  documents: ["src/**/*.graphql"],
  generates: {
    "src/api/generated.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-rtk-query"],
      config: {
        importBaseApiFrom: "./baseApi",
        importBaseApiValue: "api",
        exportHooks: true,
        enumsAsTypes: true,
        // --- ДОДАЙ ЦЕЙ БЛОК НИЖЧЕ ---
        overrideConfig: {
          attributes: {
            GetForms: {
              providesTags: ["Form"],
            },
            CreateForm: {
              invalidatesTags: ["Form"],
            },
          },
        },
        // ----------------------------
      },
    },
  },
};

export default config;
