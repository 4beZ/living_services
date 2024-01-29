import { GridColDef } from "@mui/x-data-grid"

export const columns: { [key: string]: GridColDef[] } = {
  applications: [
    { field: "Номер_заявки", headerName: "ID", width: 70 },
    { field: "Тип_проблемы", headerName: "Тип проблемы", width: 130 },
    { field: "Описание_проблемы", headerName: "Проблема", width: 250 },
    {
      field: "Статус_выполнения",
      headerName: "Статус",
      type: "singleSelect",
      valueOptions: ["Accepted", "In progress", "Solved"],
      editable: true,
      width: 150,
    },
  ],
  operators: [
    { field: "Номер_оператора", headerName: "ID", width: 70 },
    { field: "Имя", width: 100 },
    { field: "Телефон", width: 120 },
    {
      field: "Название_отделения",
      headerName: "Название отделения",
      width: 200,
    },
  ],
  residents: [
    { field: "Номер_жителя", headerName: "ID", width: 70 },
    { field: "Имя", width: 100 },
    { field: "Мобильный_телефон", headerName: "Телефон", width: 130 },
    { field: "Задолжность", headerName: "Долг", width: 70 },
    { field: "Улица", width: 100 },
    { field: "Дом", width: 50 },
    { field: "Корпус", headerName: "Корп", width: 50 },
    { field: "Подъезд", headerName: "Пд", width: 50 },
    { field: "Квартира", headerName: "Кв", width: 50 },
  ],
  cars: [
    { field: "Номер_машины", headerName: "ID", width: 70 },
    { field: "Марка", width: 100 },
    { field: "Год_выпуска", headerName: "Год", width: 100 },
    { field: "Пробег", width: 100 },
    { field: "Масса", width: 100 },
    { field: "Статус", width: 100 },
    { field: "Номер_автопарка", headerName: "Автопарк", width: 100 },
  ],
  departments: [
    { field: "ID", width: 70 },
    { field: "Название", width: 100 },
    { field: "Район", width: 100 },
    { field: "Улица", width: 120 },
    { field: "Дом", width: 70 },
    { field: "Подъезд", width: 100 },
    { field: "Аварийность", width: 100 },
  ],
  tools: [
    { field: "ID", width: 7 },
    { field: "Тип", width: 100 },
    { field: "Год", width: 100 },
    { field: "Предназначение", width: 200 },
    { field: "Склад", width: 100 },
  ],
}
