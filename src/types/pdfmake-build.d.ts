declare module 'pdfmake/build/pdfmake' {
  import type { TCreatedPdf, TDocumentDefinitions, TVirtualFileSystem } from 'pdfmake/interfaces';

  interface PdfMakeBrowser {
    createPdf: (documentDefinitions: TDocumentDefinitions) => TCreatedPdf;
    addVirtualFileSystem: (vfs: TVirtualFileSystem) => void;
    vfs?: TVirtualFileSystem;
  }

  const pdfMake: PdfMakeBrowser;
  export default pdfMake;
}

declare module 'pdfmake/build/vfs_fonts' {
  import type { TVirtualFileSystem } from 'pdfmake/interfaces';

  type VfsExport =
    | TVirtualFileSystem
    | {
        vfs?: TVirtualFileSystem;
        pdfMake?: { vfs: TVirtualFileSystem };
      };

  const vfsFonts: VfsExport;
  export default vfsFonts;
}
