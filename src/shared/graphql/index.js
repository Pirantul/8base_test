import gql from 'graphql-tag';


export const CLIENT_CREATE_MUTATION = gql`
  mutation ClientCreate($data: ClientCreateInput!) {
    clientCreate(data: $data) {
      id
    }
  }
`;

export const CLIENT_UPDATE_MUTATION = gql`
  mutation ClientUpdate($data: ClientUpdateInput!) {
    clientUpdate(data: $data) {
      id
    }
  }
`;

export const CLIENT_DELETE_MUTATION = gql`
  mutation ClientDelete($id: ID!) {
    clientDelete(data: { id: $id }) {
      success
    }
  }
`;

export const CLIENTS_LIST_QUERY = gql`
  query ClientsList {
    clientsList {
      items {
        id
        firstName
        lastName
        email
        phone
        birthday
      }
    }
  }
`;

export const ORDER_CREATE_MUTATION = gql`
  mutation OrderCreate($data: OrderCreateInput!) {
    orderCreate(data: $data) {
      id
    }
  }
`;

export const ORDER_UPDATE_MUTATION = gql`
  mutation OrderUpdate($data: OrderUpdateInput!) {
    orderUpdate(data: $data) {
      id
    }
  }
`;

export const ORDER_DELETE_MUTATION = gql`
  mutation OrderDelete($id: ID!) {
    orderDelete(data: { id: $id }) {
      success
    }
  }
`;


export const ORDERS_LIST_QUERY = gql`
  query OrdersList {
    ordersList {
      items {
        id
        address
        deliveryDt
        comment
        status 
        client {
          id
          firstName
          lastName
        }
        orderItems {
          items {
            product {
              id
              name
            }
            quantity
          }
        }
      }
      
    }
  }
`;

export const ORDERITEM_CREATE_MUTATION = gql`
  mutation OrderItemCreate($data: OrderItemCreateInput!) {
    orderItemCreate(data: $data) {
      id
    }
  }
`;

export const ORDERITEM_UPDATE_MUTATION = gql`
  mutation OrderItemUpdate($data: OrderItemUpdateInput!) {
    orderItemUpdate(data: $data) {
      id
    }
  }
`;

export const ORDERITEM_DELETE_MUTATION = gql`
  mutation OrderItemDelete($id: ID!) {
    orderItemDelete(data: { id: $id }) {
      success
    }
  }
`;


export const ORDERITEMS_LIST_QUERY = gql`
  query OrderItemsList ($id: ID!) {
    orderItemsList(filter: {
      product: 
      {id:	{
            contains: $id
          }
      }
    }) {
      items {
        id
        product {
          id
          name
        }        
        quantity 
      }
      
    }
  }
`;

export const PRODUCT_CREATE_MUTATION = gql`
  mutation ProductCreate($data: ProductCreateInput!) {
    productCreate(data: $data) {
      id
    }
  }
`;

export const PRODUCT_UPDATE_MUTATION = gql`
  mutation ProductUpdate($data: ProductUpdateInput!) {
    productUpdate(data: $data) {
      id
    }
  }
`;

export const PRODUCT_DELETE_MUTATION = gql`
  mutation ProductDelete($id: ID!) {
    productDelete(data: { id: $id }) {
      success
    }
  }
`;


export const PRODUCTS_LIST_QUERY = gql`
  query ProductList {
    productsList {
      items {
        id
        picture {
            id
            downloadUrl
            shareUrl
        }
        name
        description
        price
      }
    }
  }
`;

