"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTranslations } from "next-intl";
import { SortableStep } from "@/components/onboarding-screen/sortable-step";
import { useShowcaseStore } from "@/hooks/use-showcase-store";
import { useOnboarding } from "@/hooks/use-onboarding";
import Image from "next/image";
import ButtonOutline from "../ui/button-outline";
import apiClient from "@/lib/apiService";
import { ErrorModal } from "../error-modal";

export const OnboardingScreen = () => {
  const t = useTranslations();
  const { showcaseJSON, selectedCharacter,personaIds } = useShowcaseStore();
  const {
    screens,
    selectedStep,
    initializeScreens,
    setSelectedStep,
    moveStep,
    removeStep,
    setStepState,
    stepState,
    setScenarioId
  } = useOnboarding();


  const Data = {
    "issuanceFlow": {
      "id": "789e4567-e89b-12d3-a456-434314174123",
      "name": "Credential Issuance",
      "description": "This workflow issues credentials to users",
      "type": "ISSUANCE",
      "steps": [
        {
          "id": "123e4567-e89b-12d3-a456-434314174000",
          "title": "Verify Identity",
          "description": "Verify the user's identity",
          "order": 1,
          "type": "HUMAN_TASK",
          "subFlow": "123e4567-e89b-12d3-a456-434314174000",
          "actions": [
            {
              "id": "123e4567-ef2d-12d3-abcd-426614174456",
              "title": "Connect Wallet.",
              "text": "Connect your wallet to continue"
            },
            {
              "id": "123e4567-ef2d-12d3-abcd-426614174452",
              "title": "Download Wallet",
              "text": "Download your wallet to continue"
            }
          ],
          "asset": {
            "id": "123e4567-e89b-12d3-a456-426614174469",
            "mediaType": "image/jpeg",
            "content": "base64 encoded binary data",
            "fileName": "asset.jpg",
            "description": "A beautiful image of a cat"
          }
        },
        {
          "id": "123e4567-e89b-12d3-a456-434314174001",
          "title": "Meet Jhon Doe",
          "description": "Meet and Verify the user's identity",
          "order": 1,
          "type": "HUMAN_TASK",
          "subFlow": "123e4567-e89b-12d3-a456-434314174001",
          "actions": [
            {
              "id": "123e4567-ef2d-12d3-abcd-426614174457",
              "title": "Connect Wallet.l",
              "text": "Connect your wallet to continue"
            },
            {
              "id": "123e4567-ef2d-12d3-abcd-426614174451",
              "title": "Connect Wallet.",
              "text": "Connect your wallet to continue"
            }
          ],
          "asset": {
            "id": "123e4567-e89b-12d3-a456-426614174460",
            "mediaType": "image/jpeg",
            "content": "base64 encoded binary data",
            "fileName": "asset.jpg",
            "description": "A beautiful image of a cat"
          }
        }
      ],
      "personas": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174456",
          "name": "John Doe.",
          "role": "Verifier",
          "description": "John Doe is a verifier for the system",
          "headshotImage": {
            "id": "123e4567-e89b-12d3-a456-426614174469",
            "mediaType": "image/jpeg",
            "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
            "fileName": "asset.jpg",
            "description": "A beautiful image of a cat"
          },
          "bodyImage": {
            "id": "123e4567-e89b-12d3-a456-426614174469",
            "mediaType": "image/jpeg",
            "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
            "fileName": "asset.jpg",
            "description": "A beautiful image of a cat"
          }
        }
      ],
      "issuer": {
        "id": "123e4567-e89b-12d3-abcd-426614174456",
        "name": "Issuer Name",
        "description": "This issuer issues credentials to users",
        "type": "ARIES",
        "organization": "Acme Corporation",
        "logo": {
          "id": "123e4567-e89b-12d3-a456-426614174469",
          "mediaType": "image/jpeg",
          "content": "base64 encoded binary data",
          "fileName": "asset.jpg",
          "description": "A beautiful image of a cat"
        },
        "credentialDefinitions": [
          {
            "id": "123e4567-e89b-12d3-a456-426614174123",
            "name": "Credential Definition Name",
            "version": "1.0",
            "type": "ANONCRED",
            "attributes": [
              {
                "id": "890e4567-e89b-12d3-a456-426614174123",
                "name": "name",
                "value": "John Doe",
                "type": "STRING"
              }
            ],
            "representations": [
              {
                "id": "123e4567-e89b-12d3-abcd-426614174456"
              },
              {
                "id": "123e4567-e89b-12d3-abcd-426614174456",
                "credDefId": "123e4567-e89b-12d3-a456-426614174123",
                "schemaId": "123e4567-e89b-12d3-a456-426614174123",
                "ocaBundleUrl": "https://example.com/ocaBundle.json"
              }
            ],
            "revocation": {
              "id": "abcd4567-e89b-12d3-a456-426614174123",
              "title": "Revocation Information",
              "description": "This credential is revocable"
            },
            "icon": {
              "id": "123e4567-e89b-12d3-a456-426614174469",
              "mediaType": "image/jpeg",
              "content": "base64 encoded binary data",
              "fileName": "asset.jpg",
              "description": "A beautiful image of a cat"
            }
          }
        ]
      }
    }
  };



  const Showcases = {
    "showcase": {
      "id": "123e4567-e89b-12d3-a456-426614174456",
      "name": "Credential Showcase BCGov",
      "description": "Collection of credential usage scenarios",
      "status": "PENDING",
      "hidden": false,
      "scenarios": [
        {
          "id": "789e4567-e89b-12d3-a456-434314174123",
          "name": "Credential Issuance",
          "description": "This scenario issues credentials to users",
          "type": "ISSUANCE",
          "steps": [
            {
              "id": "123e4567-e89b-12d3-a456-434314174000",
              "title": "Verify Identity",
              "description": "Verify the user's identity",
              "order": 1,
              "type": "HUMAN_TASK",
              "subScenario": "123e4567-e89b-12d3-a456-434314174000",
              "actions": [
                {
                  "id": "123e4567-ef2d-12d3-abcd-426614174451",
                  "title": "Connect Wallet",
                  "text": "Connect your wallet to continue"
                }
              ],
              "asset": {
                "id": "123e4567-e89b-12d3-a456-426614174469",
                "mediaType": "image/jpeg",
                "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
                "fileName": "asset.jpg",
                "description": "A beautiful image of a cat"
              }
            }
          ],
          "personas": [
            {
              "id": "123e4567-e89b-12d3-a456-426614174456",
              "name": "John",
              "role": "Verifier",
              "description": "John is a verifier for the system",
              "headshotImage": {
                "id": "123e4567-e89b-12d3-a456-426614174469",
                "mediaType": "image/jpeg",
                "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
                "fileName": "asset.jpg",
                "description": "A beautiful image of a cat"
              },
              "bodyImage": {
                "id": "123e4567-e89b-12d3-a456-426614174469",
                "mediaType": "image/jpeg",
                "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
                "fileName": "asset.jpg",
                "description": "A beautiful image of a cat"
              }
            }
          ]
        },
        {
          "id": "789e4567-e89b-12d3-a456-434314174126",
          "name": "Credential Issuance",
          "description": "This scenario issues credentials to users",
          "type": "ISSUANCE",
          "steps": [
            {
              "id": "123e4567-e89b-12d3-a456-434314174001",
              "title": "Verify Identity",
              "description": "Verify the user's identity",
              "order": 1,
              "type": "HUMAN_TASK",
              "subScenario": "123e4567-e89b-12d3-a456-434314174003",
              "actions": [
                {
                  "id": "123e4567-ef2d-12d3-abcd-426614174454",
                  "title": "Connect Wallet",
                  "text": "Connect your wallet to continue"
                },
                {
                  "id": "123e4567-ef2d-12d3-abcd-426614174455",
                  "title": "Download Wallet",
                  "text": "Download your wallet to continue"
                }
              ],
              "asset": {
                "id": "123e4567-e89b-12d3-a456-426614174461",
                "mediaType": "image/jpeg",
                "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
                "fileName": "asset.jpg",
                "description": "A beautiful image of a cat"
              }
            },
            {
              "id": "123e4567-e89b-12d3-a456-434314174002",
              "title": "Download Wallet",
              "description": "Download Wallet to continue",
              "order": 1,
              "type": "HUMAN_TASK",
              "subScenario": "123e4567-e89b-12d3-a456-434314174004",
              "actions": [
                {
                  "id": "123e4567-ef2d-12d3-abcd-426614174456",
                  "title": "Connect Wallet",
                  "text": "Connect your wallet to continue"
                },
                {
                  "id": "123e4567-ef2d-12d3-abcd-426614174452",
                  "title": "Download Wallet",
                  "text": "Download your wallet to continue"
                }
              ],
              "asset": {
                "id": "123e4567-e89b-12d3-a456-426614174466",
                "mediaType": "image/jpeg",
                "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
                "fileName": "asset.jpg",
                "description": "A beautiful image of a cat"
              }
            }
          ],
          "personas": [
            {
              "id": "123e4567-e89b-12d3-a456-426614174452",
              "name": "Ana",
              "role": "Student",
              "description": "Ana is a verifier for the system",
              "headshotImage": {
                "id": "123e4567-e89b-12d3-a456-426614174461",
                "mediaType": "image/jpeg",
                "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
                "fileName": "asset.jpg",
                "description": "A beautiful image of a cat"
              },
              "bodyImage": {
                "id": "123e4567-e89b-12d3-a456-426614174462",
                "mediaType": "image/jpeg",
                "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
                "fileName": "asset.jpg",
                "description": "A beautiful image of a cat"
              }
            }
          ]
        }
      ],
      "credentialDefinitions": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174127",
          "name": "Credential Definition Name",
          "issuerId": "123e4567-e89b-12d3-a456-426614174122",
          "schemaId": "123e4567-e89b-12d3-a456-426614174121",
          "identifierType": "DID",
          "identifier": "did:sov:XUeUZauFLeBNofY3NhaZCB",
          "version": "1.0",
          "type": "ANONCRED",
          "representations": [
            {
              "id": "123e4567-e89b-12d3-abcd-426614174452"
            },
            {
              "id": "123e4567-e89b-12d3-abcd-426614174453",
              "credDefId": "123e4567-e89b-12d3-a456-426614174123",
              "schemaId": "123e4567-e89b-12d3-a456-426614174123",
              "ocaBundleUrl": "https://example.com/ocaBundle.json"
            }
          ],
          "revocation": {
            "id": "abcd4567-e89b-12d3-a456-426614174123",
            "title": "Revocation Information",
            "description": "This credential is revocable"
          },
          "icon": {
            "id": "123e4567-e89b-12d3-a456-426614174469",
            "mediaType": "image/jpeg",
            "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
            "fileName": "asset.jpg",
            "description": "A beautiful image of a cat"
          }
        }
      ],
      "personas": {}
    }
  }

  const [IsOnboarding,setIsOnboarding] = useState(Data);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setErrorModal] = useState(false);
  const [Scenarios, SetScenarios] = useState<any>();

  console.log('personaIds ====',personaIds);

  const Maindata = Showcases.showcase;
  const scenarios = Maindata.scenarios;

  const scenarioData = scenarios.map((item) => item);
  console.log("Scenario Data:", scenarioData);

  // Extract personas
  const personas = scenarioData.flatMap((scenario) => scenario.personas);
  // console.log("Personas:", personas[0].id);

  let intialId = personas[0]?.id || ""
  const [selectedPersonaId, setSelectedPersonaId] = useState(intialId);


  
  // Find the selected persona
  const selectedPersona = personas.find((p) => p.id === selectedPersonaId);
  // console.log('selectedPersona',selectedPersona);

  // Find the scenario that includes this persona
  const selectedScenario = scenarioData.find((scenario) =>
    scenario.personas.some((persona) => persona.id === selectedPersonaId)
  );

  const Steps = selectedScenario ? selectedScenario.steps : []
  console.log('Stepss',Steps);

  // Extract actions from steps in the selected scenario
  const actions = selectedScenario ? selectedScenario.steps.flatMap((step) => step.actions) : [];

  console.log('Actions',actions)

  // let STeps = IsOnboarding.issuanceFlow.steps;
  let Personas = personas
  // let Issuer = IsOnboarding.issuanceFlow.issuer;

  const initialScreens = useMemo(() => {
    return JSON.parse(
      JSON.stringify(Steps)
    );
  }, [selectedCharacter,selectedPersonaId]);

  const getPersonaById = async (personaId: string) => {
    try {
      const response = await apiClient.get<any>(`/personas/${personaId}`);
      let data = response?.persona
      console.log('response of Persona:',data);
      setIsOnboarding((prevState) => {
        const newState = {
          ...prevState,
          issuanceFlow: {
            ...prevState.issuanceFlow,
            personas: [data], // Update only personas
          },
        };
        console.log("Updated state:", newState);
        return newState;
      });

      console.log('Persona: ',Personas);
      return response; // Assuming response contains the persona object

    } catch (err) {
      console.error("Error fetching persona:", err);
      return null;
    }
  };

  const getAllScenarios = async() => {
    try {
      setLoading(true);
      console.log(`Fetching issuance flow`);
      const response = await apiClient.get(`/scenarios/issuances`);
      console.log("Issuance Flow Data:", response);
      setLoading(false)
      return response;
    } catch (error) {
      console.error("Error fetching issuance flow:", error);
      setLoading(false)
      setErrorModal(true);
    }
  }
  

  useEffect(() => {
    initializeScreens(initialScreens);
  }, [initialScreens, initializeScreens]);


  useEffect(() => {
    // getIssuanceFlow('871b9ac3-f7a5-42ee-80c8-14f1587cb83d');
    // getAllScenarios();
    // createScenario();
    // let Maindata = Showcases.showcase
    // let scenarios = Maindata.scenarios
    // let abc = scenarios.map((item) => {
    //   return item
    // })
    // console.log('Scenario Data :',abc)
    // let personas = abc.map((per) => {
    //   return per
    // })

    // console.log('Persona',personas);
    // if(personaIds){
    //   getPersonaById(personaIds)
    // }
  },[])

  const createScenario = async () => {
    try {
      setLoading(true);
      const scenarioData = {
        name: "Credential Issuance",
        description: "This scenario issues credentials to users",
        steps: [
          {
            title: "Verify Identity",
            description: "Verify the user's identity",
            order: 1,
            type: "HUMAN_TASK",
            asset: "456e4567-e89b-12d3-a456-426614174000",
            // subScenario: "123e4567-e89b-12d3-a456-434314174000",
            actions: [
              {
                title: "Download Wallet",
                text: "Download your wallet to continue",
                actionType: "ARIES_OOB",
                proofRequest: {
                                "attributes": {
                                    "attribute1": {
                                        "attributes": ["attribute1", "attribute2"],
                                        "restrictions": ["restriction1", "restriction2"]
                                    }
                                },
                                "predicates": {
                                    "predicate1": {
                                        "name": "example_name",
                                        "type": "example_type",
                                        "value":"example_value",
                                        "restrictions": ["restriction1","restriction2"]
                                    }
                                }
                            }
              },
            ]
          },
        ],
        personas: personaIds,
        hidden: false,
        issuer: "70692d76-319e-493b-b585-01e7f7b9cae4",
      };
  
      const response:any = await apiClient.post("/scenarios/issuances", scenarioData);
      console.log("Scenario Created:", response);
      let Id = response?.issuanceScenarios?.id
      setScenarioId(Id)
      getIssuanceFlow(Id);
      setLoading(false)
      return response;
    } catch (error) {
      console.error("Error creating scenario:", error);
      setLoading(false)
      setErrorModal(true);
      // throw error;
    }
  };
  

  
 const getIssuanceFlow = async (issuanceFlowId: string) => {
  try {
    setLoading(true);
    console.log(`Fetching issuance flow: ${issuanceFlowId}`);
    const response:any = await apiClient.get(`/scenarios/issuances/${issuanceFlowId}`);
    console.log("Issuance Flow Data:", response);
    SetScenarios(response?.issuanceScenarios);
    setLoading(false)
    return response;
  } catch (error) {
    console.error("Error fetching issuance flow:", error);
    setLoading(false)
    setErrorModal(true);
  }
};

 const updateIssuanceFlow = async (issuanceFlowId: string, data: any) => {
  try {
    console.log(`Updating issuance flow: ${issuanceFlowId} with data:`, data);
    const response = await apiClient.put(`/scenarios/issuances/${issuanceFlowId}`, data);
    console.log("Issuance Flow Updated:", response);
    setLoading(false)
    return response;
  } catch (error) {
    console.error("Error updating issuance flow:", error);
    setLoading(false)
    setErrorModal(true);
  }
};

 const createIssuanceStep = async (issuanceFlowId: string, stepData: any) => {
  try {
    console.log(`Creating issuance step for flow: ${issuanceFlowId} with data:`, stepData);
    const response = await apiClient.post(`/scenarios/issuances/${issuanceFlowId}/steps`, stepData);
    console.log("Issuance Step Created:", response);
    setLoading(false)
    return response;
  } catch (error) {
    console.error("Error creating issuance step:", error);
    setLoading(false)
    setErrorModal(true);
  }
};

 const updateIssuanceStep = async (issuanceFlowId: string, stepId: string, stepData: any) => {
  try {
    console.log(`Updating issuance step ${stepId} for flow ${issuanceFlowId} with data:`, stepData);
    const response = await apiClient.put(`/scenarios/issuances/${issuanceFlowId}/steps/${stepId}`, stepData);
    console.log("Issuance Step Updated:", response);
    setLoading(false)
    return response;
  } catch (error) {
    console.error("Error updating issuance step:", error);
    setLoading(false)
    setErrorModal(true);
  }
};

 const createIssuanceStepAction = async (issuanceFlowId: string, stepId: string, actionData: any) => {
  try {
    console.log(`Creating action for step ${stepId} in flow ${issuanceFlowId} with data:`, actionData);
    const response = await apiClient.post(`/scenarios/issuances/${issuanceFlowId}/steps/${stepId}/actions`, actionData);
    console.log("Issuance Step Action Created:", response);
    setLoading(false)
    return response;
  } catch (error) {
    console.error("Error creating issuance step action:", error);
    setLoading(false)
    setErrorModal(true);
  }
};

 const updateIssuanceStepAction = async (
  issuanceFlowId: string,
  stepId: string,
  actionId: string,
  actionData: any
) => {
  try {
    console.log(`Updating action ${actionId} for step ${stepId} in flow ${issuanceFlowId} with data:`, actionData);
    const response = await apiClient.put(
      `/scenarios/issuances/${issuanceFlowId}/steps/${stepId}/actions/${actionId}`,
      actionData
    );
    console.log("Issuance Step Action Updated:", response);
    setLoading(false)
    return response;
  } catch (error) {
    console.error("Error updating issuance step action:", error);
  }
};

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    const oldIndex = screens.findIndex(
      (screen) => screen.id === active.id
    );
    const newIndex = screens.findIndex((screen) => screen.id === over.id);

    if (oldIndex !== newIndex) {
      moveStep(oldIndex, newIndex);
      setSelectedStep(newIndex);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const index = screens.findIndex(
      (screen) => screen.id === event.active.id
    );
    setSelectedStep(index);
  };

 
  return (
    <>
    {showErrorModal && <ErrorModal errorText="Unknown error occurred" setShowModal={setErrorModal}/>}
       <>
       {loading &&
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            Loading Scenario
          </div>
        }
       <div className="bg-white dark:bg-dark-bg-secondary text-light-text dark:text-dark-text">
        <div className="flex bg-gray-100 rounded-md border-b">
          {/* {Data && Data.issuanceFlow.personas?.map((char: any, index: number) => ( */}
          {Personas && Personas?.map((char: any, index: number) => (
            <div
              key={char.id}
              onClick={() => setSelectedPersonaId(char.id)}
              className={`w-full p-4 text-center border ${
                index === 0
                  ? "bg-white dark:bg-dark-bg shadow-md"
                  : "bg-gray-200"
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mb-2">
                  <Image
                    // src={char.headshotImage.content}
                    src={
                      char.headshotImage?.content ||
                      "/assets/NavBar/Joyce.png"
                    }
                    alt={char.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>

                <div className="text-lg font-semibold">{char.name}</div>
                <div className="text-sm text-gray-500">{char.role}</div>

                {/* {stepState == "no-selection" && (
                  <div className="w-full mt-2 px-3 py-1 bg-yellow-400 text-xs font-semibold rounded">
                    Incomplete
                  </div>
                )} */}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-cols">
          <div className="border-b w-full light-border dark:dark-border">
            <div className="p-4">
              <h2 className="text-base font-bold">
                {t("onboarding.editing_steps_label", { name: selectedPersona?.name})}
                {/* {t("onboarding.editing_steps_label", { name: "Ana" })} */}
              </h2>
              <p className="text-xs">{t("onboarding.editing_steps_message")}</p>
            </div>
          </div>
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={screens.map((screen) => screen.id)}
            strategy={verticalListSortingStrategy}
          >
            {screens.map((screen, index) => (
              <div key={screen.id} className="flex flex-row">
                <SortableStep
                  selectedStep={selectedStep}
                  myScreen={screen}
                  stepIndex={index + 1}
                  totalSteps={screens.length}
                />
              </div>
            ))}

            <DragOverlay>
              {selectedStep !== null && Steps[selectedStep] && (
                <div className="top-1">
                  <p>{Steps[selectedStep].title}</p>
                  <div className="highlight-container w-full flex flex-row justify-items-center items-center rounded p-3 unselected-item backdrop-blur">
                    <p className="text-sm">{Steps[selectedStep].description}</p>
                  </div>
                </div>
              )}
            </DragOverlay>
          </SortableContext>
        </DndContext>
      </div>

      <div className="p-4 mt-auto pt-10">
        <ButtonOutline
          onClick={() => {
            setStepState("creating-new");
            window.scrollTo({ top: 200, behavior: "smooth" });
          }}
          className="w-full"
        >
          {t("onboarding.add_step_label")}
        </ButtonOutline>
      </div>
       </>
    </>
  );
};

