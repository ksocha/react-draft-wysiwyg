import React, { HTMLAttributes } from 'react';
import { Field, Form, FormProps } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { ToolModal } from '../common/ToolModal';

interface Values {
  title: string;
  target: string;
  openInNewWindow: boolean;
}

export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  isOpen: boolean;
  onSubmit: FormProps<Values>['onSubmit'];
  onCancel: () => void;
  initialValues: FormProps<Values>['initialValues'];
}

export const AddLinkModal = React.forwardRef<HTMLDivElement, Props>(
  ({ onSubmit, onCancel, initialValues, ...rest }, ref) => (
    <Form<Values>
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, submitting }) => (
        <ToolModal {...rest} ref={ref}>
          <form onSubmit={handleSubmit}>
            <Field
              name="title"
              // validate={} TODO: required
              render={({ input }) => {
                return (
                  <label className="rdw-link-modal-label">
                    <FormattedMessage id="wysiwygEditor.link.linkTitle" />

                    <input className="rdw-link-modal-input" {...input} />
                  </label>
                );
              }}
            />

            <Field
              name="target"
              // validate={} TODO: required
              render={({ input }) => {
                return (
                  <label className="rdw-link-modal-label">
                    <FormattedMessage id="wysiwygEditor.link.linkTarget" />

                    <input className="rdw-link-modal-input" {...input} />
                  </label>
                );
              }}
            />

            <Field
              name="openInNewWindow"
              type="checkbox"
              render={({ input }) => {
                return (
                  <label className="rdw-link-modal-target-option">
                    <input {...input} />

                    <span>
                      <FormattedMessage id="wysiwygEditor.link.openInNewWindow" />
                    </span>
                  </label>
                );
              }}
            />

            <span className="rdw-link-modal-buttonsection">
              <button className="rdw-link-modal-btn" type="submit" disabled={submitting}>
                <FormattedMessage id="wysiwygEditor.generic.add" />
              </button>

              <button className="rdw-link-modal-btn" type="button" onClick={onCancel}>
                <FormattedMessage id="wysiwygEditor.generic.cancel" />
              </button>
            </span>
          </form>
        </ToolModal>
      )}
    />
  )
);
