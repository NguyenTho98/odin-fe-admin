function generatePermission() {
  const entities = [
    "api",
    "assignment",
    "course",
    "exam",
    "examQuestion",
    "lesson",
    "material",
    "quizz",
    "quizzQuestion",
    "role",
    "session",
    "slide",
    "user",
    "room",
    "billing",
    "roomuser",
    "voucher",
    "revenue",
    "student",
    "orders",
    "mentor",
    "asset",
    "userLesson",
    "ordersMentorAdmin",
  ];

  let data = {};
  //common permission
  entities.forEach((it) => {
    data[it + "_search"] = it + ".search";
    data[it + "_add"] = it + ".add";
    data[it + "_update"] = it + ".update";
    data[it + "_delete"] = it + ".delete";
  });

  return data;
}

export const permission = generatePermission();
