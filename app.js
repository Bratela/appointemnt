
new Vue({
    el: '#app',
    data: {
        headers: [],
        rows: [],
        searchQuery: '',
        selectedRows: [],
        selectAll: false,
        newRow: {
            firstName: '',
            lastName: '',
            personalCode: '',
            billsNumber:''
        },
        submittedRow: {
            firstName: '',
            lastName: '',
            personalCode: '',
            billsNumber:''
        }
    },
    created() {
        axios.get('list_2.csv')
            .then(response => {
                this.parseCSV(response.data);
            })
            .catch(error => {
                console.error("Ошибка при загрузке CSV файла:", error);
            });
    },
    methods: {
        parseCSV(data) {
            const lines = data.split('\n');
            if (lines.length > 0) {
                this.headers = lines[0].split('|');
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.trim() === '') continue;
                    const row = line.split('|');
                    this.rows.push(row);
                }
            }
        },
        toggleAll() {
            this.selectedRows = this.selectAll ? [...this.filteredRows] : [];
        },
        addRow() {
            // Сохраняем введенные имя и фамилию в submittedRow
            this.submittedRow.firstName = this.newRow.firstName;
            this.submittedRow.lastName = this.newRow.lastName;
            this.submittedRow.personalCode = this.newRow.personalCode;
            this.submittedRow.billsNumber = this.newRow.billsNumber;
            // Очищаем поля ввода
            this.newRow.firstName = '';
            this.newRow.lastName = '';
            this.newRow.personalCode = '';
            this.newRow.billsNumber = '';
        },
        printSelectedTable() {
            // добавляем стили

            // Получаем ссылку на элемент с классом 'selected-table'
            const selectedTable = document.querySelector('.printable-table');

            // Клонируем выбранный элемент для печати
            const clonedTable = selectedTable.cloneNode(true);

            const link = document.createElement('link')
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'print_style.css';

            // Создаем новое окно для печати
            const printWindow = window.open('', '_blank');

            // Добавляем стили и клонированный элемент в новое окно для печати
            printWindow.document.body.appendChild(clonedTable);
            printWindow.document.head.appendChild(link);

            // Печатаем содержимое
            //printWindow.print();
        }

    },
    computed: {
        filteredRows() {
            if (!this.searchQuery) {
                return this.rows;
            }
            return this.rows.filter(row => {
                return row.some(cell => cell.toString().toLowerCase().includes(this.searchQuery.toLowerCase()));
            });
        },

        selectedPrices() {
            let sum = 0;
            this.selectedRows.forEach(row => {
                const price = parseFloat(row[1]);
                if (!isNaN(price)) {
                    sum += price;
                }
            });
            return sum.toFixed(2); // Округление до 2 знаков после запятой
        },


        watch: {
            selectedRows() {
                this.selectAll = this.selectedRows.length === this.filteredRows.length;
            }
        },


    }
});
