import React from 'react';
import { compose } from 'recompose';
import * as R from 'ramda';
import { Table, Dropdown, Icon, Menu, withModal } from '@8base/boost';
import { graphql } from 'react-apollo';

import * as sharedGraphQL from '../../shared/graphql';

// import { BrokerCreateDialog } from './BrokerCreateDialog';
// import { BrokerDeleteDialog } from './BrokerDeleteDialog';

let ItemsTable = ({ orderItems, openModal, closeModal }) => (
  <Table>
    }
    <Table.Header columns="repeat(4, 1fr) 60px">
      <Table.HeaderCell>Product</Table.HeaderCell>
      <Table.HeaderCell>Quantity</Table.HeaderCell>
      <Table.HeaderCell />
    </Table.Header>

    {/* <Table.Body loading={ brokers.loading } data={ R.pathOr([], ['brokersList', 'items'], brokers) }  action="Create Broker" onActionClick={() => openModal(BrokerCreateDialog.id)}> */}
    <Table.Body loading={ orderItems.loading } data={ R.pathOr([], ['orderItemsList', 'items'], orderItems) } >
      {
        (item) => (
          <Table.BodyRow columns="repeat(4, 1fr) 60px" key={ item.id }>
            <Table.BodyCell>
              { R.pathOr('Unititled', ['product', 'name'], item) }
            </Table.BodyCell>
            <Table.BodyCell>
            { R.pathOr('Unititled', ['quantity'], item) }
            </Table.BodyCell>
            <Table.BodyCell>
              <Dropdown defaultOpen={ false }>
                <Dropdown.Head>
                  <Icon name="More" color="LIGHT_GRAY2" />
                </Dropdown.Head>
                <Dropdown.Body pin="right">
                  {
                    ({ closeDropdown }) => (
                      <Menu>
                        {/* <Menu.Item onClick={ () => { openModal(BrokerDeleteDialog.id, { id: broker.id }); closeDropdown(); } }>Delete</Menu.Item> */}
                      </Menu>
                    )
                  }
                </Dropdown.Body>
              </Dropdown>
            </Table.BodyCell>
          </Table.BodyRow>
        )
      }
    </Table.Body>
  </Table>
);

ItemsTable = graphql(sharedGraphQL.ORDERITEMS_LIST_QUERY, { name: 'orderItems' })
(ItemsTable);

ItemsTable.id = "ck9zy3uu400lo07jvchdeg451";

export { ItemsTable };
