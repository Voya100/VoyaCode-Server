export const MailgunMock = () => ({
  messages: () => ({
    send: () => {}
  }),
  lists: () => ({
    members: () => ({
      create: () => {},
      update: () => {}
    })
  })
});
