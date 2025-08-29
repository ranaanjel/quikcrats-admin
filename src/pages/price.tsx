import { DataTable } from "@/components/data-table-price";
import { SectionCards } from "@/components/section-cards-price";

export function Price(){
    return   <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <DataTable />
            </div>
          </div>
        </div>
}