import React from 'react';
import * as R from 'ramda';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, InputField, SelectField, ModalContext, DateInputField, TableBuilder } from '@8base/boost';
import { graphql, Query } from 'react-apollo';
import { ItemsTable } from './ItemsTable';

import { FileInputField } from '../../shared/components/FileInputField';
import * as sharedGraphQL from '../../shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from '../../shared/constants';

const ORDERITEMS_TABLE_COLUMNS = [
  { name: 'product', title: 'Product', sortEnable: false },
  
];

const ORDER_EDIT_DIALOG_ID = 'ORDER_EDIT_DIALOG_ID';

class OrderEditDialog extends React.Component {
  static contextType = ModalContext;

  createOnSubmit = (id) => async (data) => {
    await this.props.orderUpdate({ variables: { data: { ...data, id } }});

    this.context.closeModal(ORDER_EDIT_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(ORDER_EDIT_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={ handleSubmit }>
      <Dialog.Header title="Edit Order" onClose={ this.onClose } />
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
          <Grid.Box>
            {/* <Field name="orderItems" label="Item" component={ InputField } /> */}
            {/* <Field name="orderItems" label="Item" component={ InputField } /> */}
            {/* { R.pathOr(0, ['orderItems', 'items', 'length'], data) } */}
            {this.renderTable}
          </Grid.Box>
          <Grid.Box>
            <ItemsTable />
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ this.onClose }>Cancel</Button>
        <Button color="primary" type="submit" disabled={ pristine || invalid } loading={ submitting }>Update Order</Button>
      </Dialog.Footer>
    </form>
  );

  renderTable = ({ data, loading }) => {
    console.log(data);
    
    const { tableState, onChange } = this.props;

    const total = R.pathOr(null, ['orderItems', 'count'], data);

    const tableData = R.pathOr([], ['orderItems', 'items'], data);
    const finalTableState = R.assocPath(['pagination', 'total'], total, tableState);

    return (
      <TableBuilder
        columns={ ORDERITEMS_TABLE_COLUMNS }
        data={ tableData }
        loading={ loading }
        //action="Create Order"
        //onActionClick={ this.onActionClick }
        tableState={ finalTableState }
        //onChange={ onChange }
        renderCell={ this.renderCell }
        withPagination
      />
    );
  };

  renderCell = (column, data) => {
    const { openModal } = this.props;

    let rendered = String(data[column.name]);

    return rendered;
  }

  renderForm = ({ args }) => {
    return (
      <Form type="UPDATE" tableSchemaName="Orders" onSubmit={ this.createOnSubmit(args.initialValues.id) } initialValues={ args.initialValues } formatRelationToIds>
        { this.renderFormContent }
      </Form>
    );
  };

  render() {
    return (
      <Dialog id={ ORDER_EDIT_DIALOG_ID } size="sm">
        { this.renderForm }
      </Dialog>
    );
  }
}

OrderEditDialog = graphql(sharedGraphQL.ORDER_UPDATE_MUTATION, {
  name: 'orderUpdate',
  options: {
    refetchQueries: ['OrdersList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Order successfuly updated'
    },
  },
})(OrderEditDialog);

OrderEditDialog.id = ORDER_EDIT_DIALOG_ID;

export { OrderEditDialog };