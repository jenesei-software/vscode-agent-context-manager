import * as path from "node:path";
import * as vscode from "vscode";
import { APP_IDS, type AppId } from "./model/types";
import { homeDir, resolveToken } from "./util/paths";

export const CONFIG_SECTION = "agentContext";

export const KEYS = {
  agentsRoot: "agentsRoot",
  showThirdPartySkills: "showThirdPartySkills",
  enabledApps: "enabledApps",
} as const;

export function getConfig(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration(CONFIG_SECTION);
}

export function agentsRootSetting(): string {
  const configured = getConfig().get<string>(KEYS.agentsRoot)?.trim() ?? "";
  if (configured === "") {
    return path.join(homeDir(), ".agents");
  }
  return resolveToken(configured);
}

export function showThirdPartySkills(): boolean {
  return getConfig().get<boolean>(KEYS.showThirdPartySkills) ?? true;
}

export function enabledApps(): AppId[] {
  const configured = getConfig().get<string[]>(KEYS.enabledApps);
  const known = new Set<string>(APP_IDS);
  if (!configured || configured.length === 0) {
    return [...APP_IDS];
  }
  return configured.filter((id): id is AppId => known.has(id));
}

export function workspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}
