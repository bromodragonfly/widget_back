export class HookBodyDto {
  event: HookEvent;
  action: {
    code: string;
    settings: HookActionSettings;
  };
  subdomain: string;
  account_id: string;
}

interface HookEvent {
  type: string;
  type_code: string;
  data: HookEventData;
  time: string;
}

interface HookEventData {
  id: string;
  element_type: string;
  status_id: string;
  pipeline_id: string;
}

interface HookActionSettings {
  widget: HookActionSettingsWidget;
  widget_info: HookActionSettingsWidgetInfo;
  optional_conditions: { main_event: string };
  row: string;
  created_by: string;
}

export interface HookActionSettingsWidget {
  settings: {
    users: string;
    text: string;
    sad: string;
    id: string;
    audio: string;
    userPicture?: string;
  };
}

interface HookActionSettingsWidgetInfo {
  id: string;
  code: string;
  name: string;
}
