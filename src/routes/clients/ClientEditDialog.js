import React from 'react';
import * as R from 'ramda';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, InputField, SelectField, ModalContext, DateInputField } from '@8base/boost';
import { graphql, Query } from 'react-apollo';

import * as sharedGraphQL from '../../shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from '../../shared/constants';

//const getPropertyOptions = (properties = []) => properties.map((property) => ({ value: property.id, label: property.title }));
//const getUserOptions = (users = []) => users.map((item) => ({ value: item.id, label: `${R.pathOr('Unititled', ['user', 'firstName'], item)} ${R.pathOr('Unititled', ['user', 'lastName'], item)}` }));

const CLIENT_EDIT_DIALOG_ID = 'CLIENT_EDIT_DIALOG_ID';

class ClientEditDialog extends React.Component {
  static contextType = ModalContext;

  
  createOnSubmit = (id) => async (data) => {
    await this.props.clientUpdate({ variables: { data: { ...data, id } }});

    this.context.closeModal(CLIENT_EDIT_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(CLIENT_EDIT_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={ handleSubmit }>
      <Dialog.Header title="Edit Client" onClose={ this.onClose } />
      <Dialog.Body scrollable>
        <Grid.Layout gap="sm" stretch>
          <Grid.Box>
            <Field name="firstName" label="First Name" component={ InputField } />
          </Grid.Box>
          <Grid.Box>
            <Field name="lastName" label="Last Name" component={ InputField } />
          </Grid.Box>
          <Grid.Box>
            <Field name="email" label="Email" component={ InputField } />
          </Grid.Box>
          <Grid.Box>
            <Field name="phone" label="Phone" component={ InputField } />
          </Grid.Box>
          <Grid.Box>
            <Field name="birthday" label="Birthday" component={ DateInputField } />
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ this.onClose }>Cancel</Button>
        <Button color="primary" type="submit" disabled={ pristine || invalid } loading={ submitting }>Update Client</Button>
      </Dialog.Footer>
    </form>
  );

  renderForm = ({ args }) => {
    return (
      <Form type="UPDATE" tableSchemaName="Clients" onSubmit={ this.createOnSubmit(args.initialValues.id) } initialValues={ args.initialValues } formatRelationToIds>
        { this.renderFormContent }
      </Form>
    );
  };

  render() {
    return (
      <Dialog id={ CLIENT_EDIT_DIALOG_ID } size="sm">
        { this.renderForm }
      </Dialog>
    );
  }
}

ClientEditDialog = graphql(sharedGraphQL.CLIENT_UPDATE_MUTATION, {
  name: 'clientUpdate',
  options: {
    refetchQueries: ['ClientsList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Client successfuly updated'
    },
  },
})(ClientEditDialog);

ClientEditDialog.id = CLIENT_EDIT_DIALOG_ID;

export { ClientEditDialog };