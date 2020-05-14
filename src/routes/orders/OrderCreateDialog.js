import React from 'react';
import * as R from 'ramda';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, InputField, SelectField, DateInputField, ModalContext } from '@8base/boost';
import { Query, graphql } from 'react-apollo';

import * as sharedGraphQL from '../../shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from '../../shared/constants';

//const getPropertyOptions = (properties = []) => properties.map((property) => ({ value: property.id, label: property.title }));
// const getUserOptions = (users = []) => users.map((item) => ({
//   value: item.id,
//   label: `${R.propOr('Unititled', 'firstName', item.user)} ${R.propOr('Unititled', 'lastName', item.user)}`,
//}));

const ORDER_CREATE_DIALOG_ID = 'ORDER_CREATE_DIALOG_ID';

class OrderCreateDialog extends React.Component {
  static contextType = ModalContext;

  onSubmit = async (data) => {
    await this.props.orderCreate({ variables: { data }});

    this.context.closeModal(ORDER_CREATE_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(ORDER_CREATE_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={ handleSubmit }>
      <Dialog.Header title="New Order" onClose={ this.onClose } />
      <Dialog.Body scrollable>
        <Grid.Layout gap="sm" stretch>
        <Grid.Box>
            <Query query={ sharedGraphQL.CLIENTS_LIST_QUERY }>
              {
                ({ data, loading }) => (
                  <Field
                    name="clientName"
                    label="ClientName"
                    placeholder="Select a client"
                    component={ SelectField }
                    loading={ loading }
                    options={ loading ? [] : (data.clientsList.items || []).map((client) => ({ value: client.id, label: `${client.firstName} ${client.lastName}` })) }
                    stretch
                  />
                )
              }
            </Query>
          </Grid.Box>
          <Grid.Box>
            <Field name="address" label="Address" type="text" placeholder="Address" component={ InputField } />
          </Grid.Box>
          <Grid.Box>
            <Field name="deliveryDt" label="Delivery Dt" withTime component={ DateInputField } />
          </Grid.Box>
          <Grid.Box>
            <Field name="comment" label="Comment" type="text" placeholder="Comment" component={ InputField } />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="status"
              label="Status"
              placeholder="Select a status"
              component={ SelectField }
              options={ [
                { label: 'Opened', value: 'Opened' },
                { label: 'Paid', value: 'Paid' },
                { label: 'ReadyToDelivery', value: 'ReadyToDelivery' },
                { label: 'Delivering', value: 'Delivering' },
                { label: 'Closed', value: 'Closed' },
                { label: 'Cancelled', value: 'Cancelled' },
              ] }
              stretch
            />
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ this.onClose }>Cancel</Button>
        <Button color="primary" type="submit" loading={ submitting }>Create Order</Button>
      </Dialog.Footer>
    </form>
  );

  render() {
    return (
      <Dialog id={ ORDER_CREATE_DIALOG_ID } size="sm">
        <Form type="CREATE" tableSchemaName="Orders" onSubmit={ this.onSubmit }>
          { this.renderFormContent }
        </Form>
      </Dialog>
    );
  }
}

OrderCreateDialog = graphql(sharedGraphQL.ORDER_CREATE_MUTATION, {
  name: 'orderCreate',
  options: {
    refetchQueries: ['OrdersList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Order successfuly created'
    },
  },
})(OrderCreateDialog);

OrderCreateDialog.id = ORDER_CREATE_DIALOG_ID;

export { OrderCreateDialog };