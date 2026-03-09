import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { LibraryContent } from "../lib/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const sklearnPath = path.join(root, "content", "commands", "sklearn.json");

function modelWorkflow(importLine: string, ctor: string) {
  return `import pandas as pd\nfrom sklearn.model_selection import train_test_split\n${importLine}\nimport joblib\n\ndf = pd.DataFrame({\n    'tenure': [3, 12, 8, 24, 6, 30, 18, 5],\n    'monthly_spend': [35, 70, 55, 95, 40, 110, 80, 38],\n    'tickets': [5, 1, 2, 0, 4, 0, 1, 6],\n    'churn': [1, 0, 0, 0, 1, 0, 0, 1]\n})\n\nX = df[['tenure', 'monthly_spend', 'tickets']]\ny = df['churn']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)\n\nmodel = ${ctor}\nmodel.fit(X_train, y_train)\npreds = model.predict(X_test)\nprint(preds.shape)\n\njoblib.dump(model, 'sk_model.joblib')\nloaded = joblib.load('sk_model.joblib')\nprint(loaded.predict(X_test.head(1)))`;
}

function updateExamples(lib: LibraryContent) {
  for (const command of lib.commands) {
    const ex = command.examples[0];

    switch (command.id) {
      case "sklearn-train-test-split":
        ex.title = "Complete train/test modeling workflow";
        ex.scenario = "Churn model setup with explicit X/y creation, splitting, fitting, and inference.";
        ex.code = `import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\n\ndf = pd.DataFrame({\n    'tenure': [3, 12, 8, 24, 6, 30],\n    'monthly_spend': [35, 70, 55, 95, 40, 110],\n    'churn': [1, 0, 0, 0, 1, 0]\n})\n\nX = df[['tenure', 'monthly_spend']]\ny = df['churn']\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42, stratify=y)\nmodel = LogisticRegression(max_iter=500)\nmodel.fit(X_train, y_train)\nprint(model.predict(X_test))`;
        ex.expectedOutput = "Predicted class array for holdout rows.";
        break;

      case "sklearn-standardscaler":
        ex.title = "Scale features before fitting classifier";
        ex.scenario = "Normalize numeric churn features before logistic regression fitting.";
        ex.code = `import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\ndf = pd.DataFrame({\n    'tenure': [3, 12, 8, 24, 6, 30],\n    'monthly_spend': [35, 70, 55, 95, 40, 110],\n    'churn': [1, 0, 0, 0, 1, 0]\n})\n\nX = df[['tenure', 'monthly_spend']]\ny = df['churn']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)\n\nscaler = StandardScaler()\nX_train_scaled = scaler.fit_transform(X_train)\nX_test_scaled = scaler.transform(X_test)\n\nmodel = LogisticRegression(max_iter=500)\nmodel.fit(X_train_scaled, y_train)\nprint(model.predict(X_test_scaled))`;
        ex.expectedOutput = "Predicted class array after scaled fit/predict workflow.";
        break;

      case "sklearn-columntransformer":
        ex.title = "Mixed-type preprocessing + model fit";
        ex.scenario = "Preprocess numeric and categorical fields together before training.";
        ex.code = `import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.preprocessing import OneHotEncoder, StandardScaler\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.linear_model import LogisticRegression\n\ndf = pd.DataFrame({\n    'channel': ['ads', 'email', 'ads', 'seo', 'email', 'seo'],\n    'monthly_spend': [1200, 700, 1500, 300, 650, 520],\n    'tenure': [3, 12, 2, 18, 9, 6],\n    'churn': [0, 0, 0, 1, 0, 1]\n})\n\nX = df[['channel', 'monthly_spend', 'tenure']]\ny = df['churn']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)\n\nprep = ColumnTransformer([\n    ('cat', OneHotEncoder(handle_unknown='ignore'), ['channel']),\n    ('num', StandardScaler(), ['monthly_spend', 'tenure'])\n])\n\npipe = Pipeline([('prep', prep), ('model', LogisticRegression(max_iter=500))])\npipe.fit(X_train, y_train)\nprint(pipe.predict(X_test))`;
        ex.expectedOutput = "Predicted class array using mixed-type preprocessing pipeline.";
        break;

      case "sklearn-pipeline":
      case "sklearn-make-pipeline":
        ex.title = "Pipeline fit, inference, and deployment artifact";
        ex.scenario = "Train a reusable pipeline and save/load it for deployment-style scoring.";
        ex.code = `import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.pipeline import Pipeline, make_pipeline\nimport joblib\n\ndf = pd.DataFrame({\n    'tenure': [3, 12, 8, 24, 6, 30],\n    'monthly_spend': [35, 70, 55, 95, 40, 110],\n    'churn': [1, 0, 0, 0, 1, 0]\n})\n\nX = df[['tenure', 'monthly_spend']]\ny = df['churn']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)\n\npipe = ${command.id === 'sklearn-pipeline' ? "Pipeline([('scale', StandardScaler()), ('model', LogisticRegression(max_iter=500))])" : "make_pipeline(StandardScaler(), LogisticRegression(max_iter=500))"}\npipe.fit(X_train, y_train)\nprint(pipe.predict(X_test))\n\njoblib.dump(pipe, 'pipeline.joblib')\nloaded = joblib.load('pipeline.joblib')\nprint(loaded.predict(X_test.head(1)))`;
        ex.expectedOutput = "Predicted classes and a deployed-model single-row prediction.";
        break;

      case "sklearn-gridsearchcv":
      case "sklearn-randomizedsearchcv":
        ex.title = "Hyperparameter search with fit workflow";
        ex.scenario = "Tune model hyperparameters and fit best estimator on training data.";
        ex.code = `import numpy as np\nfrom sklearn.model_selection import ${command.id === 'sklearn-gridsearchcv' ? 'GridSearchCV' : 'RandomizedSearchCV'}\nfrom sklearn.ensemble import RandomForestClassifier\n\nX = np.array([[0.1,1.0],[0.2,0.8],[0.8,0.2],[0.9,0.1],[0.15,0.85],[0.75,0.25]])\ny = np.array([0,0,1,1,0,1])\n\nsearch = ${command.id === 'sklearn-gridsearchcv' ? "GridSearchCV(RandomForestClassifier(random_state=42), {'n_estimators':[50,100], 'max_depth':[2,4]}, cv=3)" : "RandomizedSearchCV(RandomForestClassifier(random_state=42), {'n_estimators':[50,100,200], 'max_depth':[2,4,6]}, n_iter=3, cv=3, random_state=42)"}\nsearch.fit(X, y)\nprint(search.best_params_)\nprint(search.best_estimator_.predict(X[:2]))`;
        ex.expectedOutput = "Best params dict and predictions from fitted best estimator.";
        break;

      case "sklearn-cross-val-score":
      case "sklearn-cross-validate":
      case "sklearn-stratifiedkfold":
        ex.title = "Cross-validation workflow";
        ex.scenario = "Validate model stability with fold-based evaluation before deployment.";
        ex.code = `import numpy as np\nfrom sklearn.model_selection import ${command.id === 'sklearn-stratifiedkfold' ? 'StratifiedKFold' : command.id === 'sklearn-cross-validate' ? 'cross_validate' : 'cross_val_score'}\nfrom sklearn.linear_model import LogisticRegression\n\nX = np.array([[0.1,1.0],[0.2,0.8],[0.8,0.2],[0.9,0.1],[0.15,0.85],[0.75,0.25]])\ny = np.array([0,0,1,1,0,1])\nmodel = LogisticRegression(max_iter=500)\n\n${command.id === 'sklearn-stratifiedkfold' ? "cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)\nfor fold, (tr, te) in enumerate(cv.split(X, y), 1):\n    model.fit(X[tr], y[tr])\n    print(f'fold={fold}, preds={model.predict(X[te]).tolist()}')" : command.id === 'sklearn-cross-validate' ? "scores = cross_validate(model, X, y, cv=3, scoring=['accuracy','roc_auc'])\nprint(scores['test_accuracy'])\nprint(scores['test_roc_auc'])" : "scores = cross_val_score(model, X, y, cv=3, scoring='accuracy')\nprint(scores)"}`;
        ex.expectedOutput = "Fold-level or aggregate validation metrics showing model stability.";
        break;

      case "sklearn-confusion-matrix":
      case "sklearn-classification-report":
      case "sklearn-roc-auc-score":
      case "sklearn-mean-squared-error":
      case "sklearn-r2-score":
        ex.title = "Fit model then evaluate with target metric";
        ex.scenario = "Complete training workflow that ends with the specific evaluation metric.";
        ex.code = `import numpy as np\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression, LinearRegression\nfrom sklearn.metrics import ${command.name}\n\n${command.id === 'sklearn-mean-squared-error' || command.id === 'sklearn-r2-score' ? "X = np.array([[1],[2],[3],[4],[5],[6]])\ny = np.array([2,4,6,8,10,12])\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\npreds = model.predict(X_test)\nprint(" + command.name + "(y_test, preds))" : "X = np.array([[0.1,1.0],[0.2,0.8],[0.8,0.2],[0.9,0.1],[0.15,0.85],[0.75,0.25]])\ny = np.array([0,0,1,1,0,1])\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)\nmodel = LogisticRegression(max_iter=500)\nmodel.fit(X_train, y_train)\npreds = model.predict(X_test)\n" + (command.id === 'sklearn-roc-auc-score' ? "proba = model.predict_proba(X_test)[:, 1]\nprint(roc_auc_score(y_test, proba))" : command.id === 'sklearn-confusion-matrix' ? "print(confusion_matrix(y_test, preds))" : "print(classification_report(y_test, preds))")}`;
        ex.expectedOutput = "Printed metric output computed after explicit fit and prediction steps.";
        break;

      case "sklearn-pca":
        ex.title = "Dimensionality reduction before model fitting";
        ex.scenario = "Reduce correlated features with PCA and then fit a downstream classifier.";
        ex.code = `import numpy as np\nfrom sklearn.decomposition import PCA\nfrom sklearn.linear_model import LogisticRegression\n\nX = np.array([[0.1,1.0,0.9],[0.2,0.8,0.7],[0.8,0.2,0.3],[0.9,0.1,0.2],[0.15,0.85,0.8],[0.75,0.25,0.4]])\ny = np.array([0,0,1,1,0,1])\n\npca = PCA(n_components=2, random_state=42)\nX_reduced = pca.fit_transform(X)\n\nmodel = LogisticRegression(max_iter=500)\nmodel.fit(X_reduced, y)\nprint(X_reduced.shape)\nprint(model.predict(X_reduced[:2]))`;
        ex.expectedOutput = "Reduced feature shape and model predictions on reduced space.";
        break;

      case "sklearn-onehotencoder":
        // Keep previously high-detail example; no overwrite
        break;

      default:
        if (command.id.startsWith("sklearn-") &&
          [
            "sklearn-logisticregression",
            "sklearn-randomforestclassifier",
            "sklearn-linearregression",
            "sklearn-ridge",
            "sklearn-lasso",
            "sklearn-decisiontreeclassifier",
            "sklearn-gradientboostingclassifier",
            "sklearn-kneighborsclassifier",
            "sklearn-svc"
          ].includes(command.id)) {
          const map: Record<string, { importLine: string; ctor: string }> = {
            "sklearn-logisticregression": { importLine: "from sklearn.linear_model import LogisticRegression", ctor: "LogisticRegression(max_iter=500)" },
            "sklearn-randomforestclassifier": { importLine: "from sklearn.ensemble import RandomForestClassifier", ctor: "RandomForestClassifier(n_estimators=150, random_state=42)" },
            "sklearn-linearregression": { importLine: "from sklearn.linear_model import LinearRegression", ctor: "LinearRegression()" },
            "sklearn-ridge": { importLine: "from sklearn.linear_model import Ridge", ctor: "Ridge(alpha=1.0)" },
            "sklearn-lasso": { importLine: "from sklearn.linear_model import Lasso", ctor: "Lasso(alpha=0.05)" },
            "sklearn-decisiontreeclassifier": { importLine: "from sklearn.tree import DecisionTreeClassifier", ctor: "DecisionTreeClassifier(max_depth=4, random_state=42)" },
            "sklearn-gradientboostingclassifier": { importLine: "from sklearn.ensemble import GradientBoostingClassifier", ctor: "GradientBoostingClassifier(random_state=42)" },
            "sklearn-kneighborsclassifier": { importLine: "from sklearn.neighbors import KNeighborsClassifier", ctor: "KNeighborsClassifier(n_neighbors=3)" },
            "sklearn-svc": { importLine: "from sklearn.svm import SVC", ctor: "SVC(probability=True, random_state=42)" }
          };

          const setup = map[command.id];
          ex.title = `${command.name} fit/predict/deploy workflow`;
          ex.scenario = "Train model, run predictions, and persist artifact for deployment scoring.";
          ex.code = modelWorkflow(setup.importLine, setup.ctor);
          ex.expectedOutput = "Predictions plus deployed-model inference output.";
        }
        break;
    }

    ex.walkthrough = [
      "Prepare a toy but realistic dataset with business feature names.",
      `Apply ${command.name} in an end-to-end fit/predict workflow (or preprocessing/evaluation flow).`,
      "Reuse the same structure with your production feature table and deployment checks."
    ];
  }
}

async function main() {
  const raw = await fs.readFile(sklearnPath, "utf8");
  const lib = JSON.parse(raw) as LibraryContent;

  updateExamples(lib);

  await fs.writeFile(sklearnPath, `${JSON.stringify(lib, null, 2)}\n`, "utf8");
  console.log("Revised sklearn examples to command-specific full workflows.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
