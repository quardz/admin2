{
  key:ID,
  dbColumn:ID, 
  label:Field lable, 
  formly: {},
  preprocess: cb//call this function 
  required: 
}

      <ngx-datatable class="bootstrap w-100" 
      #posttable
      [selected]="selectedRows"
      selectionType="checkbox"
      [selectAllRowsOnPage]="false"
      [displayCheck]="displayCheck"
      [rows]="rows" 
      (select)="onSelect($event)"
      columnMode = 'force'
      trackByProp = 'ID'
      [limit]="10"
      [headerHeight]="50"
      [footerHeight]="50"
      rowHeight="auto"
      [columns]="columns"> 
      <ngx-datatable-column
      [width]="30"
      [sortable]="false"
      [canAutoResize]="false"
      [draggable]="false"
      [resizeable]="false"
      [headerCheckboxable]="true"
      [checkboxable]="true"
      >
      </ngx-datatable-column>
      
      <ngx-datatable-column name="post_title" minWidth = "300" cellClass = "hoverwrap">
        <ng-template let-column="column" ngx-datatable-header-template>{{ column.name }}</ng-template>
        <ng-template let-value="value" let-row="row" ngx-datatable-cell-template >
          <div class = "w-100">
            {{ value }}
            <div class = "hoveropen" *ngIf = "row.ID > 1">
              <ul class = "list-inline mb-0">
                <li class="list-inline-item"><a class = "href" >Edit</a></li>
                <li class="list-inline-item"><a class = "href" >Quick Edit</a></li>
                <li class="list-inline-item"><a class = "href" >Delete</a></li>
                <li class="list-inline-item"><a class = "href" >View</a></li>
              </ul>

            </div>
          </div>
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column name="post_author"></ngx-datatable-column>
      <ngx-datatable-column name="comment_count" maxWidth = "100"></ngx-datatable-column>
      <ngx-datatable-column name="post_date" maxWidth = "100"></ngx-datatable-column>

      </ngx-datatable>
