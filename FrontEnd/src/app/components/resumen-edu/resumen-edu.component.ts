import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ResumenEdu } from 'src/app/Models/resumenEdu.model';
import { ResumenEduService } from 'src/app/Services/resumen-edu.service';

@Component({
  selector: 'app-resumen-edu',
  templateUrl: './resumen-edu.component.html',
  styleUrls: ['./resumen-edu.component.css']
})
export class ResumenEduComponent implements OnInit {

  resumenEdu: ResumenEdu[];
    ResumenEdu = new ResumenEdu();
    closeResult: string;
    eduForm: FormGroup;
    private deleteId: number;
    
  
  
    constructor(config: NgbModalConfig, 
      private modalService: NgbModal,
      private form: FormBuilder,
      private ResumenEduService:ResumenEduService,
      public httpClient:HttpClient) {
     
      config.backdrop = 'static';
      config.keyboard = false;
    }
  
    
  
    ngOnInit(): void {
      this.ResumenEduService.getResumenEdu().subscribe(data => {this.resumenEdu = data})
      this.eduForm = this.form.group({
        id: [''],
        titulo: [''],
        institucion: [''],
        fechaIni: [''],
        fechaFin: [''],
        descripcion: [''],
        
      });
    }
  
    // Submit(){
    //   console.log(this.eduForm.value);
    // }
  
    openEdit(targetModal, resumenEdu:ResumenEdu) {
      this.modalService.open(targetModal, {
        centered: true,
        backdrop: 'static',
        size: 'lg'
      });
      this.eduForm.patchValue( {
        id: resumenEdu.id,
        titulo: resumenEdu.titulo,
        institucion: resumenEdu.institucion,
        fechaIni: resumenEdu.fechaIni,
        fechaFin: resumenEdu.fechaFin,
        descripcion: resumenEdu.descripcion,
      });
     }

     guardar(){
      const url = 'http://localhost:8080/resumenEdu/crear';
      console.log(this.eduForm.value);
       this.httpClient.post(url, this.eduForm.value).subscribe(res=>{this.resumenEdu!=res,
      this.ngOnInit();
    })
      this.modalService.dismissAll();
    }
    
  
  
    editar() {
      const editURL = 'http://localhost:8080/resumenEdu/' + 'editar/'  + this.eduForm.value.id ;
      this.httpClient.put(editURL, this.eduForm.value)
        .subscribe((results) => {
          this.ngOnInit();
          this.modalService.dismissAll();
        });
    }
  
    openDelete(targetModal, resumenEdu:ResumenEdu) {
      this.deleteId = resumenEdu.id;
      this.modalService.open(targetModal, {
        backdrop: 'static',
        size: 'lg'
      });
    }
  
    onDelete() {
      const deleteURL = 'http://localhost:8080/resumenEdu/' +  'borrar/'+ this.deleteId ;
      this.httpClient.delete(deleteURL)
        .subscribe((results) => {
          this.ngOnInit();
          this.modalService.dismissAll();
        });
    }
  
  
    openModal(content) {
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  
    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return `with: ${reason}`;
      }
    }
  
  
  }
  

