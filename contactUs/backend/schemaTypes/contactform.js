
export const restaurantInfo = {
    name: 'restaurantInfo',
    title: 'Restaurant Information',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Restaurant Name',
        type: 'string',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'address',
        title: 'Address',
        type: 'string',
      },
      {
        name: 'phone',
        title: 'Phone',
        type: 'string',
      },
      {
        name: 'email',
        title: 'Email Address',
        type: 'string',
      },
    ],
  }

export const contactMessage = {
    name: 'contactMessage',
    title: 'Contact Message',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'phone',
        title: 'Phone',
        type: 'string',
      },
      {
        name: 'message',
        title: 'Message',
        type: 'text',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'createdAt',
        title: 'Created At',
        type: 'datetime',
        options: {
          dateFormat: 'YYYY-MM-DD',
          timeFormat: 'HH:mm',
          timeStep: 15,
        },
        readOnly: true,
      },
    ],
}
export default [restaurantInfo, contactMessage];