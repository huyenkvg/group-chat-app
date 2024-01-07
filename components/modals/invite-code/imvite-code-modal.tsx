"use client";
import { Check, Copy, RefreshCw, UserPlus } from "lucide-react";
import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IServer } from "@/typing/model-types";
import CustomModal from "../custom-modal";

export const InviteModal = ({ server }: { server: Partial<IServer> }) => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  const [inviteUrl, setInviteUrl] = useState(
    `${origin}/invite/${server?.inviteCode}`
  );

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/servers/${server?.id}/invite-code`, {
        method: "PATCH",
      });
      const data = await response.json();
      setInviteUrl(`${origin}/invite/${data?.inviteCode}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="text-xs text-zinc-500"
        onClick={() => {
          setOpen(true);
        }}
      >
        Invite
        <UserPlus className="w-4 h-4 ml-2" />
      </Button>
      <CustomModal
        title="Invite People"
        description=" Server invite link"
        open={open}
        dialogProps={{
          onOpenChange: (open) => {
            if (!open) {
              onNew();
            }
            setOpen(open);
          },
        }}
      >
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={isLoading} onClick={onCopy} size="icon">
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
          >
            Rregenerate invite link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CustomModal>
    </>
  );
};
