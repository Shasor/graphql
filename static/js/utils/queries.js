export const USER_MODULE_QUERY = `
				query {
					user {
						events(where:{ event: { object: { type : { _in: ["piscine", "module"] }}}}) {
						event {
						id
						object {
							name
							type
								}
							}
						}
					}
				}`;
export const USER_INFO_QUERY = `
                query {
                    user {
                        id
                        login
                        attrs
                        totalUp
                        totalDown
                    }
                }`;
export const USER_XP_QUERY = (id) => {
  return `
				query {
					transaction_aggregate(where: {
						type: { _eq: "xp" },
						eventId: {_eq: ${id}}
					}) {
						aggregate {
							sum {
								amount
							}
						}
					}
				}`;
};
export const USER_XP_LEVEL_QUERY = (userLogin, eventID) => {
  return `
				query {
					event_user(where: { userLogin: { _eq: "${userLogin}" }, eventId: { _eq: ${eventID} } }) {
						level
					}
				}
			`;
};
export const USER_XP_PER_PROJECT_QUERY = (eventID) => {
  return `
				query {
					transaction(
						where: {
							transaction_type: { type: { _eq: "xp" } },
							eventId: { _eq: ${eventID} }
						},
						order_by: { createdAt: desc }
					) {
						amount
						isBonus
						attrs
						eventId
						createdAt
						object {
						name
						type
					}
				}
			}
            `;
};
export const USER_AUDIT_QUERY = (userName, onlyLast = false) => {
  return `
                query {
                    audit(
                        where: {
                            _and: [
                                {auditorLogin: {_eq: "${userName}"}},
								{grade: {_is_null: false}}
                            ]
                        }
                        ${onlyLast ? ', limit: 1' : ''},
                        order_by: {group: {createdAt: desc}}
                    ) {
                        private {
                            code 
                        }
                        grade
                        resultId
                        group {
                            captainLogin
                            createdAt
                            object {
                                name
                                type
                            }
                        }
                    }
                }
            `;
};
