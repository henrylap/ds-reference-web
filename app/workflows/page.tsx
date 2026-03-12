import { WorkflowsBrowser } from "@/components/workflows-browser";
import { libraryLabels, recipeList } from "@/lib/content";

export default function WorkflowsPage() {
  return <WorkflowsBrowser recipes={recipeList} labels={libraryLabels} />;
}
