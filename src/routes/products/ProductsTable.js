import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import * as R from 'ramda';
import { Paper, Link, TableBuilder, Dropdown, Icon, Menu, withModal } from '@8base/boost';
import { Query } from 'react-apollo';
import { DateTime } from 'luxon';

import * as sharedGraphQL from '../../shared/graphql';

import { ProductCreateDialog } from './ProductCreateDialog';
import { ProductEditDialog } from './ProductEditDialog';
import { ProductDeleteDialog } from './ProductDeleteDialog';

const PRODUCTS_TABLE_COLUMNS = [
  { name: 'picture', title: 'Picture', sortEnable: false },
  { name: 'name', title: 'Name', sortEnable: false },
  { name: 'description', title: 'Description', sortEnable: false },
  { name: 'price', title: 'Price', sortEnable: false },
  { name: 'actions', width: '60px', sortEnable: false },
];

class ProductsTable extends React.Component {
  onActionClick = () => {
    const { openModal } = this.props;

    openModal(ProductCreateDialog.id)
  };

  renderCell = (column, data) => {
    const { openModal } = this.props;

    let rendered = String(data[column.name]);
    
    switch (column.name) {
      case 'picture': {
        rendered = data.picture ? <img src={ data.picture.downloadUrl } alt="" style={{ width: '5rem', height: '5rem' }} /> : null;
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
                    <Menu.Item onClick={ () => { openModal(ProductEditDialog.id, {  initialValues: data }); closeDropdown(); } }>Edit</Menu.Item>
                    <Menu.Item onClick={ () => { openModal(ProductDeleteDialog.id, { id: data.id }); closeDropdown(); } }>Delete</Menu.Item>
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

    const total = R.pathOr(null, ['productsList', 'count'], data);

    const tableData = R.pathOr([], ['productsList', 'items'], data);
    const finalTableState = R.assocPath(['pagination', 'total'], total, tableState);

    return (
      <TableBuilder
        columns={ PRODUCTS_TABLE_COLUMNS }
        data={ tableData }
        loading={ loading }
        action="Create Product"
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
      <Query query={sharedGraphQL.PRODUCTS_LIST_QUERY} variables={{ orderBy, skip, first }}>
        {this.renderTable}
      </Query>
    );
  }
}

ProductsTable = compose(
  withModal,
  withStateHandlers({ tableState: { pagination: { page: 1, pageSize: 20 }}}, {
    onChange: ({ tableState }) => (value) => ({
      tableState: {
        ...tableState,
        ...value,
      },
    })
  }),
)(ProductsTable);

export { ProductsTable };
