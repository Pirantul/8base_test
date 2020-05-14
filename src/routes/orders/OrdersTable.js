import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import * as R from 'ramda';
import { Paper, Link, TableBuilder, Dropdown, Icon, Menu, withModal } from '@8base/boost';
import { Query } from 'react-apollo';
import { DateTime } from 'luxon';

import * as sharedGraphQL from '../../shared/graphql';

import { OrderCreateDialog } from './OrderCreateDialog';
import { OrderEditDialog } from './OrderEditDialog';
import { OrderDeleteDialog } from './OrderDeleteDialog';

const ORDERS_TABLE_COLUMNS = [
  { name: 'client', title: 'Client name', sortEnable: false },
  { name: 'address', title: 'Address', sortEnable: false },
  { name: 'deliveryDt', title: 'Delivery Dt', sortEnable: false },
  { name: 'comment', title: 'Comment', sortEnable: false },
  { name: 'status', title: 'Status' },
  { name: 'orderItems', title: 'OrderItems' },
  { name: 'actions', width: '60px', sortEnable: false },
];

class OrdersTable extends React.Component {
  onActionClick = () => {
    const { openModal } = this.props;

    openModal(OrderCreateDialog.id)
  };

  renderCell = (column, data) => {
    const { openModal } = this.props;

    let rendered = String(data[column.name]);

    switch (column.name) {
      case 'client': {
        rendered = `${R.pathOr('Unititled', [column.name, 'firstName'], data)} ${R.pathOr('Unititled', [column.name, 'lastName'], data)}`;
        break;
      }
      case 'deliveryDt': {
        rendered =  data.deliveryDt ? DateTime.fromISO(data.deliveryDt).toFormat('ff') : 'none';
        break;
      }
      case 'orderItems': {
        rendered = (
          <Dropdown defaultOpen={ false }>
            <Dropdown.Head>
              { R.pathOr(0, ['orderItems', 'items', 'length'], data) } items
            </Dropdown.Head>
            
          </Dropdown>
        );
        break;
      }
      case 'actions': {
        rendered = (
          <Dropdown defaultOpen={ false }>
            <Dropdown.Head>
              <Icon name="More" color="LIGHT_GRAY2" />
            </Dropdown.Head>
            <Dropdown.Body pin="right">
              {
                ({ closeDropdown }) => (
                  <Menu>
                    <Menu.Item onClick={ () => { openModal(OrderEditDialog.id, {  initialValues: data }); closeDropdown(); } }>Edit</Menu.Item>
                    <Menu.Item onClick={ () => { openModal(OrderDeleteDialog.id, { id: data.id }); closeDropdown(); } }>Delete</Menu.Item>
                  </Menu>
                )
              }
            </Dropdown.Body>
          </Dropdown>
        );

        break;
      }
      default: {
        break;
      }
    }

    return rendered;
  }

  renderTable = ({ data, loading }) => {
    const { tableState, onChange } = this.props;

    const total = R.pathOr(null, ['ordersList', 'count'], data);

    const tableData = R.pathOr([], ['ordersList', 'items'], data);
    const finalTableState = R.assocPath(['pagination', 'total'], total, tableState);

    return (
      <TableBuilder
        columns={ ORDERS_TABLE_COLUMNS }
        data={ tableData }
        loading={ loading }
        action="Create Order"
        onActionClick={ this.onActionClick }
        tableState={ finalTableState }
        onChange={ onChange }
        renderCell={ this.renderCell }
        withPagination
      />
    );
  };

  render() {
    const { tableState } = this.props;

    const skip = (tableState.pagination.page - 1) * tableState.pagination.pageSize;
    const first = tableState.pagination.pageSize;
    const orderBy = R.propOr([], 'sort', tableState).map(({ name, order }) => `${name}_${order}`);

    return (
      <Query query={sharedGraphQL.ORDERS_LIST_QUERY} variables={{ orderBy, skip, first }}>
        {this.renderTable}
      </Query>
    );
  }
}

OrdersTable = compose(
  withModal,
  withStateHandlers({ tableState: { pagination: { page: 1, pageSize: 20 }}}, {
    onChange: ({ tableState }) => (value) => ({
      tableState: {
        ...tableState,
        ...value,
      },
    })
  }),
)(OrdersTable);

export { OrdersTable };
