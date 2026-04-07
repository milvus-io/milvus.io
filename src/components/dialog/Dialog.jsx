import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/utils/merge';

export const CustomizedDialogs = ({ open, handleClose, title, content }) => (
  <Dialog open={open} onOpenChange={v => !v && handleClose()}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <p>{content}</p>
    </DialogContent>
  </Dialog>
);

export const CustomizedContentDialogs = ({
  open,
  handleClose,
  title,
  actions = null,
  children,
  classes = {},
}) => {
  const {
    title: customTitleClass = '',
    actions: customActionClass = '',
    root = '',
  } = classes;

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent className={cn(root)}>
        <DialogHeader>
          <DialogTitle className={cn(customTitleClass)}>{title}</DialogTitle>
        </DialogHeader>
        <div>{children}</div>
        {actions && (
          <DialogFooter className={cn(customActionClass)}>
            {actions}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
