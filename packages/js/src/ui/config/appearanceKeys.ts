/*
 * The double underscore signals that entire key extends the right part of the key
 * i.e. foo__bar means that foo_bar is an extension of bar. Both keys will be applied when foo_bar is used
 * meaning you would have `bar foo__bar` in the dom
 */
export const appearanceKeys = [
  // Primitives
  'button',
  'input',
  'icon',
  'badge',
  'popoverContent',
  'popoverTrigger',
  'popoverClose',

  'dropdownContent',
  'dropdownTrigger',
  'dropdownItem',
  'dropdownItemLabel',
  'dropdownItemLabelContainer',
  'dropdownItemLeft__icon',
  'dropdownItemRight__icon',
  'dropdownItem__icon',

  'collapsible',

  'tooltipContent',
  'tooltipTrigger',

  'datePicker',
  'datePickerGrid',
  'datePickerGridRow',
  'datePickerGridCell',
  'datePickerGridCellTrigger',
  'datePickerTrigger',
  'datePickerGridHeader',
  'datePickerControl',
  'datePickerControlPrevTrigger',
  'datePickerControlNextTrigger',
  'datePickerControlPrevTrigger__icon',
  'datePickerControlNextTrigger__icon',
  'datePickerCalendar',
  'datePickerHeaderMonth',
  'datePickerCalendarDay__button',

  'timePicker',
  'timePicker__hourSelect',
  'timePicker__minuteSelect',
  'timePicker__periodSelect',
  'timePicker__separator',
  'timePickerHour__input',
  'timePickerMinute__input',

  'snoozeDatePicker',
  'snoozeDatePicker__actions',
  'snoozeDatePickerCancel__button',
  'snoozeDatePickerApply__button',
  'snoozeDatePicker__timePickerContainer',
  'snoozeDatePicker__timePickerLabel',

  'back__button',

  'skeletonText',
  'skeletonAvatar',
  'skeletonSwitch',
  'skeletonSwitchThumb',

  'tabsRoot',
  'tabsList',
  'tabsContent',
  'tabsTrigger',
  'dots',

  // General
  'root',
  'bellIcon',
  'lockIcon',
  'bellContainer',
  'bellDot',
  'preferences__button',
  'preferencesContainer',
  'inboxHeader',
  'loading',

  // Inbox
  'inboxContent',
  'inbox__popoverTrigger',
  'inbox__popoverContent',

  // Notifications
  'notificationListContainer',
  'notificationList',
  'notificationListEmptyNoticeContainer',
  'notificationListEmptyNoticeOverlay',
  'notificationListEmptyNoticeIcon',
  'notificationListEmptyNotice',
  'notificationList__skeleton',
  'notificationList__skeletonContent',
  'notificationList__skeletonItem',
  'notificationList__skeletonAvatar',
  'notificationList__skeletonText',
  'notificationListNewNotificationsNotice__button',

  'notification',
  'notificationContent',
  'notificationTextContainer',
  'notificationDot',
  'notificationSubject',
  'notificationSubject__strong',
  'notificationBody',
  'notificationBody__strong',
  'notificationBodyContainer',
  'notificationImage',
  'notificationImageLoadingFallback',
  'notificationDate',
  'notificationDateActionsContainer',
  'notificationDefaultActions',
  'notificationCustomActions',
  'notificationPrimaryAction__button',
  'notificationSecondaryAction__button',
  'notificationRead__button',
  'notificationUnread__button',
  'notificationArchive__button',
  'notificationUnarchive__button',
  'notificationSnooze__button',
  'notificationUnsnooze__button',
  'notificationRead__icon',
  'notificationUnread__icon',
  'notificationArchive__icon',
  'notificationUnarchive__icon',
  'notificationSnooze__icon',
  'notificationUnsnooze__icon',

  // Notifications tabs
  'notificationsTabs__tabsRoot',
  'notificationsTabs__tabsList',
  'notificationsTabs__tabsContent',
  'notificationsTabs__tabsTrigger',
  'notificationsTabsTriggerLabel',
  'notificationsTabsTriggerCount',

  // Inbox status
  'inboxStatus__title',
  'inboxStatus__dropdownTrigger',
  'inboxStatus__dropdownContent',
  'inboxStatus__dropdownItem',
  'inboxStatus__dropdownItemLabel',
  'inboxStatus__dropdownItemLabelContainer',
  'inboxStatus__dropdownItemLeft__icon',
  'inboxStatus__dropdownItemRight__icon',
  'inboxStatus__dropdownItem__icon',
  'inboxStatus__dropdownItemCheck__icon',
  // More actions
  'moreActionsContainer',
  'moreActions__dropdownTrigger',
  'moreActions__dropdownContent',
  'moreActions__dropdownItem',
  'moreActions__dropdownItemLabel',
  'moreActions__dropdownItemLeft__icon',
  'moreActions__dots',

  // More tabs
  'moreTabs__button',
  'moreTabs__icon',
  'moreTabs__dropdownTrigger',
  'moreTabs__dropdownContent',
  'moreTabs__dropdownItem',
  'moreTabs__dropdownItemLabel',
  'moreTabs__dropdownItemRight__icon',

  // workflow
  'workflowContainer',
  'workflowLabel',
  'workflowLabelHeader',
  'workflowLabelHeaderContainer',
  'workflowLabelIcon',
  'workflowLabelContainer',
  'workflowContainerDisabledNotice',
  'workflowLabelDisabled__icon',
  'workflowContainerRight__icon',
  'workflowArrow__icon',
  'workflowDescription',

  // preference groups
  'preferencesGroupContainer',
  'preferencesGroupHeader',
  'preferencesGroupLabelContainer',
  'preferencesGroupLabelIcon',
  'preferencesGroupLabel',
  'preferencesGroupActionsContainer',
  'preferencesGroupActionsContainerRight__icon',
  'preferencesGroupBody',
  'preferencesGroupChannels',
  'preferencesGroupInfo',
  'preferencesGroupInfoIcon',
  'preferencesGroupWorkflows',

  // channel
  'channelContainer',
  'channelIconContainer',
  'channel__icon',
  'channelsContainerCollapsible',
  'channelsContainer',
  'channelLabel',
  'channelLabelContainer',
  'channelName',
  'channelSwitchContainer',
  'channelSwitch',
  'channelSwitchThumb',

  // Preferences Header
  'preferencesHeader',
  'preferencesHeader__back__button',
  'preferencesHeader__back__button__icon',
  'preferencesHeader__title',
  'preferencesHeader__icon',

  // Preferences Loading
  'preferencesListEmptyNoticeContainer',
  'preferencesListEmptyNotice',
  'preferencesList__skeleton',
  'preferencesList__skeletonContent',
  'preferencesList__skeletonItem',
  'preferencesList__skeletonIcon',
  'preferencesList__skeletonSwitch',
  'preferencesList__skeletonSwitchThumb',
  'preferencesList__skeletonText',

  // Notification Snooze
  'notificationSnooze__dropdownContent',
  'notificationSnooze__dropdownItem',
  'notificationSnooze__dropdownItem__icon',
  'notificationSnoozeCustomTime_popoverContent',

  // Notification Delivered At
  'notificationDeliveredAt__badge',
  'notificationDeliveredAt__icon',
  'notificationSnoozedUntil__icon',
  // Text formatting
  'strong',
] as const;
