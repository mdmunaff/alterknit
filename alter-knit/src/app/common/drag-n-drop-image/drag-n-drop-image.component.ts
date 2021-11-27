import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-drag-n-drop-image',
  templateUrl: './drag-n-drop-image.component.html',
  styleUrls: ['./drag-n-drop-image.component.css']
})
export class DragNDropImageComponent {

  constructor() { }

  files: any[] = [];
  allowedTotalFileSize = 2.5;
  errorDescription: string = 'Image Size exceeds limit';
  showError = false;
  @Output() filesToBeUploadedEvent = new EventEmitter();
  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(fileEvent: any) {
    this.prepareFilesList(fileEvent.target?.files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    let totalSize = 0;
    this.filesToBeUploadedEvent.emit(files);
    for (const file of files) {
      totalSize = file.size + totalSize;
      file.progress = 0;
      this.files.push(file);
    }
    if (totalSize > 2.5 * 1024 * 1024) {
      this.showError = true;
      return;
    } else {
      this.showError = false;
      this.uploadFilesSimulator(0);
    }
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals?: number) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = ((decimals) ? (decimals) : 0) <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
