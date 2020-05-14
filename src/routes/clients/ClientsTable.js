import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import * as R from 'ramda';
import { TableBuilder, Dropdown, Icon, Menu, withModal } from '@8base/boost';
import { Query } from 'react-apollo';

import * as sharedGraphQL from '../../shared/graphql';

import { ClientCreateDialog } from './ClientCreateDialog';
import { ClientEditDialog } from './ClientEditDialog';
import { ClientDeleteDialog } from './ClientDeleteDialog';

const CLIENTS_TABLE_COLUMNS = [
  { name: 'firstName', title: 'First Name', sortEnable: false },
  { name: 'lastName', title: 'Last Name', sortEnable: false },
  { name: 'email', title: 'Email', sortEnable: false },
  { name: 'phone', title: 'Phone', sortEnable: false },
  { name: 'birthday', title: 'Birthday' },
  { name: 'actions', width: '60px', sortEnable: false },
];

class ClientsTable extends React.Component {
  onActionClick = () => {
    const { openModal } = this.props;

    openModal(ClientCreateDialog.id)
  };

  renderCell = (column, data) => {
    const { openModal } = this.props;

    let rendered = String(data[column.name]);

    switch (column.name) {
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
                    <Menu.Item onClick={ () => { openModal(ClientEditDialog.id, {  initialValues: data }); closeDropdown(); } }>Edit</Menu.Item>
                    <Menu.Item onClick={ () => { openModal(ClientDeleteDialog.id, { id: data.id }); closeDropdown(); } }>Delete</Menu.Item>
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

    const total = R.pathOr(null, ['clientsList', 'count'], data);

    const tableData = R.pathOr([], ['clientsList', 'items'], data);
    const finalTableState = R.assocPath(['pagination', 'total'], total, tableState);


    return (
      <TableBuilder
        columns={ CLIENTS_TABLE_COLUMNS }
        data={ tableData }
        loading={ loading }
        action="Create Client"
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
      <Query query={sharedGraphQL.CLIENTS_LIST_QUERY} variables={{ orderBy, skip, first }}>
        {this.renderTable}
      </Query>
    );
  }
}

ClientsTable = compose(
  withModal,
  withStateHandlers({ tableState: { pagination: { page: 1, pageSize: 20 }}}, {
    onChange: ({ tableState }) => (value) => ({
      tableState: {
        ...tableState,
        ...value,
      },
    })
  }),
)(ClientsTable);

export { ClientsTable };
