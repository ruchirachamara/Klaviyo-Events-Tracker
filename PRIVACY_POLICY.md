# Privacy Policy — Klaviyo Events Tracker

**Last updated:** March 23, 2026

## Overview

Klaviyo Events Tracker is a free developer tool Chrome extension that monitors Klaviyo tracking events fired on websites you visit. This policy explains how data is handled.

## Data Collection

This extension does **not** collect, transmit, or share any personal data. All captured event data is stored locally on your device using Chrome's local storage API (`chrome.storage.local`) and is never sent to any external server.

## Permissions

- **storage**: Used to persist captured events locally in your browser so they can be displayed in the extension popup.
- **content_scripts (all URLs)**: Required to detect Klaviyo tracking calls on any website. The extension only intercepts calls to the `window.klaviyo` object and does not read, modify, or collect any other page content.

## Data Storage

- All data is stored locally on your device.
- You can clear all stored events at any time using the "Clear All" button in the extension popup.
- Uninstalling the extension removes all stored data.

## Third-Party Services

This extension does not communicate with any third-party services, APIs, or servers.

## Changes

If this policy is updated, the new version will be published alongside the extension update.

## Contact

For questions about this privacy policy, please open an issue at:
https://github.com/ruchirachamara/Klaviyo-Events-Tracker/issues
