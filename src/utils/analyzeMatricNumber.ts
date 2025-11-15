import { faculties } from "@/data/faculties";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const analyzeMatricNumber = (matricNumber: string) => {
  const regex = /^BHU\/(?:[A-Z]{3}\/\d{2}\/\d{3}|\d{2}\/\d{2}\/\d{2}\/\d{4})$/;
  const match = matricNumber.match(regex);

  if (!match) {
    return {
      department: "",
      level: "",
    };
  }

  const array = matricNumber.split("/");
  if (array[1] == "SBS") {
    return {
      department: "IJMB",
      level: "IJMB",
    };
  }

  const [BHU, year, facultyId, departmentId, serial] = matricNumber.split("/");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const matricYear = parseInt("20" + year, 10);

  let level = currentYear - matricYear + (currentMonth > 7 ? 1 : 0) + "00";
  const department = faculties
        .find((faculty) => faculty.id == Number(facultyId))
        ?.departments.find((dept) => dept.id === Number(departmentId))

  if(Number(level) < 100){
    level = ''
  }

  if(department && department.duration < Number(level.replace("00", ''))){
    level = 'Alumni'
  }

  return {
    level,
    department: department?.name || "",
  };
};
